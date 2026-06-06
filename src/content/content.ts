/**
 * Single source of truth for all editable site copy.
 *
 * Every `.astro` section is presentational and reads from this object — content
 * edits never touch markup. Update text, links, stats, experience and projects
 * here and the whole site follows.
 */

export interface SocialLink {
  label: string;
  href: string;
}

export interface ExperienceEntry {
  /** Human-readable date range, e.g. "2021 — Present". */
  period: string;
  company: string;
  role: string;
  location: string;
  /** One-line framing of the role. */
  summary: string;
  /** Concrete achievements / responsibilities. */
  bullets: string[];
}

export interface Project {
  title: string;
  blurb: string;
  /** Live/external link for the project. */
  href: string;
  /** GitHub repo name under `flags.githubUser`, used to fetch live stars/language. */
  repo: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Content {
  name: string;
  /** Headline positioning — must read "Senior Full-Stack …" for SEO. */
  positioning: string;
  /** Short hero subtitle / tagline. */
  subtitle: string;
  location: string;
  about: {
    label: string;
    lead: string;
    stats: Stat[];
    principles: string[];
  };
  stack: string[];
  experience: ExperienceEntry[];
  projects: Project[];
  contact: {
    label: string;
    cta: string;
    email: string;
    socials: SocialLink[];
  };
  flags: {
    available: boolean;
    githubUser: string;
    heroVariant: 'crystal';
  };
}

export const content: Content = {
  name: 'Anton Karmanov',
  positioning: 'Senior Full-Stack / TypeScript Engineer — Ex-EXANTE, FinTech, Next.js & NestJS.',
  subtitle:
    'TypeScript end to end — React interfaces that feel instant and the Node.js / NestJS services behind them.',
  location: 'Europe · Remote',

  about: {
    label: 'About',
    lead: 'For over a decade I have built interfaces and services where attention to detail, performance and clean architecture matter as much as features. I work across the stack — React and TypeScript on the front, Node.js and NestJS with PostgreSQL on the back — and enjoy taking complex products to a state that simply feels expensive.',
    stats: [
      { value: '14', label: 'years in software engineering' },
      { value: '7', label: 'years TypeScript / React' },
      { value: '4', label: 'years Node.js / NestJS' },
    ],
    principles: [
      'Clean Architecture',
      'DDD',
      'SOLID',
      'FSD',
      'DRY',
      'KISS',
    ],
  },

  stack: [
    'TypeScript',
    'React',
    'Next.js',
    'NestJS',
    'Node.js',
    'REST',
    'PostgreSQL',
    'Sentry',
    'Docker',
  ],

  experience: [
    {
      period: 'Dec 2021 — Feb 2026',
      company: 'EXANTE',
      role: 'Senior Full-Stack Developer (Contract)',
      location: 'Limassol, Cyprus · Remote',
      summary: 'Internal back-office tools for a multi-asset brokerage platform, built with Next.js and NestJS.',
      bullets: [
        'Delivered 6 internal projects including a ~2-year flagship product, turning business requirements into shipped solutions.',
        'Built complex React interfaces for large-scale data: a multi-megabyte tree table with partial loading and virtualization, staying responsive at 10,000+ rows.',
        'Developed and maintained a NestJS backend service powering internal products and brokerage workflows.',
        'Formalized and documented previously undocumented critical processes, simplifying onboarding.',
      ],
    },
    {
      period: 'Oct 2018 — Oct 2021',
      company: 'Admitad',
      role: 'Senior Full-Stack Developer',
      location: 'Munich, Germany · Remote',
      summary: 'Worked across 4 products combining front-end delivery, legacy modernization and selected Laravel backend.',
      bullets: [
        'Shipped features and refactored 2 React applications, including SSR and Redux-Saga flows.',
        'Migrated 2 MVP products to Next.js and Nuxt, improving performance, maintainability and SEO.',
        'Mentored 2 junior developers through onboarding and code review.',
        'Added automated tests for critical user flows, reducing regression risk.',
      ],
    },
    {
      period: 'Apr 2017 — Sep 2018',
      company: 'Loymax',
      role: 'Middle Frontend Developer',
      location: 'Paphos, Cyprus',
      summary: 'Customer loyalty CRM and branded personal accounts for several retail chains.',
      bullets: [
        'Developed and maintained frontend features for the CRM and personal accounts.',
        'Unified JavaScript logic across multiple branded personal accounts.',
        'Introduced stylelint, ESLint and Babel to an AngularJS project.',
      ],
    },
    {
      period: 'Feb 2012 — Mar 2017',
      company: 'Wow digital agency',
      role: 'Junior / Middle Frontend Developer',
      location: 'Novosibirsk, Russia',
      summary: 'Websites and internal tools for agency clients.',
      bullets: [
        'Built HTML/CSS layouts, JavaScript behaviour and UI animations together with designers.',
        'Built an outstaffing intranet system using AngularJS.',
      ],
    },
  ],

  // Curated to repos that actually have GitHub stars; live stars/language are
  // fetched per `repo` at runtime. Update this list as repos gain traction.
  projects: [
    {
      title: 'gpotter-gradient',
      blurb: 'Pick a color from a linear gradient at any step — turn a PNG gradient into ready-to-use CSS.',
      href: 'https://github.com/HawkeyePierce89/gpotter-gradient',
      repo: 'gpotter-gradient',
    },
    {
      title: 'Moon-Sugar',
      blurb: 'Tiny library that adds snowfall to any website. 🎄',
      href: 'https://github.com/HawkeyePierce89/Moon-Sugar',
      repo: 'Moon-Sugar',
    },
  ],

  contact: {
    label: 'Contact',
    cta: 'Let’s build something',
    email: 'anton@karmanov.ws',
    socials: [
      { label: 'Email', href: 'mailto:anton@karmanov.ws' },
      { label: 'GitHub', href: 'https://github.com/HawkeyePierce89' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hawkeyepierce89' },
      { label: 'Telegram', href: 'https://t.me/HawkeyePierce89' },
    ],
  },

  flags: {
    available: true,
    githubUser: 'HawkeyePierce89',
    heroVariant: 'crystal',
  },
};

export default content;
