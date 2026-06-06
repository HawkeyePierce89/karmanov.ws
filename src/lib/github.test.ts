import { describe, it, expect, vi } from 'vitest';
import { fetchRepoMeta, type FetchOptions } from './github';

/** Build a minimal GitHub repo API payload. */
function repoPayload(name: string, overrides: Record<string, unknown> = {}) {
  return {
    name,
    stargazers_count: 42,
    language: 'TypeScript',
    html_url: `https://github.com/HawkeyePierce89/${name}`,
    ...overrides,
  };
}

/** A `fetch` stub that returns the given payload for any repo, in order of `names`. */
function okFetch(payloadFor: (url: string) => unknown) {
  return vi.fn(async (url: string) => ({
    ok: true,
    status: 200,
    json: async () => payloadFor(url),
  })) as unknown as typeof fetch;
}

function baseOptions(overrides: Partial<FetchOptions> = {}): FetchOptions {
  return {
    user: 'HawkeyePierce89',
    now: () => 1_000_000,
    ttlMs: 24 * 60 * 60 * 1000,
    storage: localStorage,
    ...overrides,
  };
}

describe('fetchRepoMeta', () => {
  it('maps GitHub fields and preserves input order', async () => {
    const fetchImpl = okFetch((url) => {
      const name = url.split('/').pop()!;
      return repoPayload(name, {
        stargazers_count: name === 'a' ? 10 : 20,
        language: name === 'a' ? 'TypeScript' : 'Go',
      });
    });

    const result = await fetchRepoMeta(['a', 'b'], baseOptions({ fetchImpl }));

    expect(result.map((r) => r.name)).toEqual(['a', 'b']);
    expect(result[0]).toEqual({
      name: 'a',
      stars: 10,
      language: 'TypeScript',
      url: 'https://github.com/HawkeyePierce89/a',
    });
    expect(result[1].stars).toBe(20);
    expect(result[1].language).toBe('Go');
  });

  it('reuses a fresh cache entry without hitting the network', async () => {
    const fetchImpl = okFetch((url) => repoPayload(url.split('/').pop()!));

    // First call populates the cache.
    await fetchRepoMeta(['a'], baseOptions({ fetchImpl, now: () => 1_000_000 }));
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    // Second call, still inside the TTL window — no new request.
    const result = await fetchRepoMeta(['a'], baseOptions({ fetchImpl, now: () => 1_000_000 + 1000 }));
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result[0].name).toBe('a');
  });

  it('refetches after the TTL has expired', async () => {
    const fetchImpl = okFetch((url) => repoPayload(url.split('/').pop()!));
    const ttlMs = 24 * 60 * 60 * 1000;

    await fetchRepoMeta(['a'], baseOptions({ fetchImpl, now: () => 0, ttlMs }));
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    await fetchRepoMeta(['a'], baseOptions({ fetchImpl, now: () => ttlMs + 1, ttlMs }));
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('applies defaults for missing/null fields (e.g. language: null)', async () => {
    const fetchImpl = okFetch((url) => {
      const name = url.split('/').pop()!;
      // GitHub legitimately returns language: null for repos with no detected
      // language, and may omit fields entirely.
      return { name, language: null };
    });

    const result = await fetchRepoMeta(['a'], baseOptions({ fetchImpl }));

    expect(result[0]).toEqual({
      name: 'a',
      stars: 0,
      language: null,
      url: 'https://github.com/HawkeyePierce89/a',
    });
  });

  it('omits a repo on a non-OK HTTP response (404 / rate-limit) with no cache', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not Found' }),
    })) as unknown as typeof fetch;

    const result = await fetchRepoMeta(['a'], baseOptions({ fetchImpl }));
    expect(result).toEqual([]);
  });

  it('omits only the failing repo and preserves order for the rest', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith('/b')) throw new Error('network down');
      const name = url.split('/').pop()!;
      return { ok: true, status: 200, json: async () => repoPayload(name) };
    }) as unknown as typeof fetch;

    const result = await fetchRepoMeta(['a', 'b', 'c'], baseOptions({ fetchImpl }));
    expect(result.map((r) => r.name)).toEqual(['a', 'c']);
  });

  it('ignores a corrupt cache entry and refetches', async () => {
    localStorage.setItem('gh:HawkeyePierce89:a', 'not-json{');
    const fetchImpl = okFetch((url) => repoPayload(url.split('/').pop()!));

    const result = await fetchRepoMeta(['a'], baseOptions({ fetchImpl }));
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result[0].name).toBe('a');
  });

  it('ignores a structurally-invalid cache entry (no numeric fetchedAt)', async () => {
    // A legacy/garbage entry must not leak an `undefined` meta when a refetch
    // also fails — the repo should be cleanly omitted instead.
    localStorage.setItem('gh:HawkeyePierce89:a', JSON.stringify({ meta: {} }));
    const failImpl = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;

    const result = await fetchRepoMeta(['a'], baseOptions({ fetchImpl: failImpl }));
    expect(result).toEqual([]);
  });

  it('omits a repo on network failure when there is no cache', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;

    const result = await fetchRepoMeta(['a', 'b'], baseOptions({ fetchImpl }));
    expect(result).toEqual([]);
  });

  it('returns stale cached data when a refetch errors', async () => {
    const ttlMs = 24 * 60 * 60 * 1000;
    const okImpl = okFetch((url) => repoPayload(url.split('/').pop()!, { stargazers_count: 7 }));

    // Seed the cache.
    await fetchRepoMeta(['a'], baseOptions({ fetchImpl: okImpl, now: () => 0, ttlMs }));

    // TTL expired and the network is down — should serve the stale entry.
    const failImpl = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;

    const result = await fetchRepoMeta(['a'], baseOptions({ fetchImpl: failImpl, now: () => ttlMs + 1, ttlMs }));
    expect(failImpl).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ name: 'a', stars: 7 });
  });
});
