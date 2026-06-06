/**
 * Pure, dependency-injected GitHub data layer for the projects section.
 *
 * `fetchRepoMeta` enriches a list of repo names with live stars/language from
 * the public GitHub API. Results are cached in `localStorage` (key
 * `gh:<user>:<name>`) for a configurable TTL (24h by default). On a network
 * error it serves stale cache when available, and otherwise omits the repo so
 * the static card simply renders without live numbers.
 *
 * Everything external (fetch, clock, TTL, storage, user) is injectable, which
 * keeps the module fully unit-testable with no real network or globals.
 */

/** Live metadata for a single repository. */
export interface RepoMeta {
  name: string;
  stars: number;
  language: string | null;
  url: string;
}

export interface FetchOptions {
  /** GitHub username the repos live under. */
  user?: string;
  /** `fetch` implementation (injected for tests / SSR safety). */
  fetchImpl?: typeof fetch;
  /** Current-time provider, ms since epoch. */
  now?: () => number;
  /** Cache time-to-live in ms. */
  ttlMs?: number;
  /** Storage backend for the cache. */
  storage?: Storage;
}

/** Shape of the cache entry persisted per repo. */
interface CacheEntry {
  meta: RepoMeta;
  fetchedAt: number;
}

const DEFAULT_USER = 'HawkeyePierce89';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

function cacheKey(user: string, name: string): string {
  return `gh:${user}:${name}`;
}

function isValidEntry(value: unknown): value is CacheEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.fetchedAt === 'number' &&
    Number.isFinite(entry.fetchedAt) &&
    typeof entry.meta === 'object' &&
    entry.meta !== null
  );
}

function readCache(storage: Storage | undefined, key: string): CacheEntry | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // Guard against corrupt/legacy entries: an entry without a numeric
    // `fetchedAt` would yield `NaN` comparisons and leak an `undefined` meta.
    return isValidEntry(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(storage: Storage | undefined, key: string, entry: CacheEntry): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(entry));
  } catch {
    /* storage full or unavailable — caching is best-effort */
  }
}

/** Map a raw GitHub repo API payload onto our `RepoMeta`. */
function toMeta(name: string, user: string, raw: Record<string, unknown>): RepoMeta {
  return {
    name,
    stars: typeof raw.stargazers_count === 'number' ? raw.stargazers_count : 0,
    language: typeof raw.language === 'string' ? raw.language : null,
    url:
      typeof raw.html_url === 'string'
        ? raw.html_url
        : `https://github.com/${user}/${name}`,
  };
}

/** Resolve a single repo's metadata, honouring cache, TTL and stale-on-error. */
async function resolveOne(name: string, opts: Required<FetchOptions>): Promise<RepoMeta | null> {
  const { user, fetchImpl, now, ttlMs, storage } = opts;
  const key = cacheKey(user, name);
  const cached = readCache(storage, key);

  if (cached && now() - cached.fetchedAt < ttlMs) {
    return cached.meta;
  }

  try {
    const res = await fetchImpl(`https://api.github.com/repos/${user}/${name}`);
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const raw = (await res.json()) as Record<string, unknown>;
    const meta = toMeta(name, user, raw);
    writeCache(storage, key, { meta, fetchedAt: now() });
    return meta;
  } catch {
    // Network/API failure: serve stale cache if we have it, otherwise omit.
    return cached ? cached.meta : null;
  }
}

/**
 * Fetch live metadata for the given repo names, preserving input order.
 *
 * Repos that fail with no cached fallback are omitted from the result.
 */
export async function fetchRepoMeta(
  names: string[],
  options: FetchOptions = {},
): Promise<RepoMeta[]> {
  const opts: Required<FetchOptions> = {
    user: options.user ?? DEFAULT_USER,
    fetchImpl: options.fetchImpl ?? fetch,
    now: options.now ?? (() => Date.now()),
    ttlMs: options.ttlMs ?? DEFAULT_TTL_MS,
    storage: options.storage ?? (typeof localStorage !== 'undefined' ? localStorage : (undefined as unknown as Storage)),
  };

  const settled = await Promise.all(names.map((name) => resolveOne(name, opts)));
  return settled.filter((meta): meta is RepoMeta => meta != null);
}

export default fetchRepoMeta;
