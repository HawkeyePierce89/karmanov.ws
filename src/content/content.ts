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
    heroVariant: 'blob';
  };
}

export const content: Content = {
  name: 'Anton Karmanov',
  positioning: 'Senior Full-Stack Engineer building fast, resilient products for the web.',
  subtitle:
    'TypeScript end to end — from React interfaces that feel instant to the Node services behind them.',
  location: 'Europe · Remote',

  about: {
    label: 'About',
    lead: '14 years turning ambiguous product ideas into shipped, reliable software. I work across the stack — React and TypeScript on the front, Node and Postgres on the back — and care most about the seam where engineering quality meets a great user experience.',
    stats: [
      { value: '14', label: 'years building for the web' },
      { value: '7', label: 'product teams shipped with' },
      { value: '4', label: 'fintech & marketplace platforms' },
    ],
    principles: [
      'Types first',
      'Ship small, ship often',
      'Performance is a feature',
      'Accessibility by default',
      'Own the outcome',
    ],
  },

  stack: [
    'TypeScript',
    'React',
    'Node.js',
    'Astro',
    'Next.js',
    'GraphQL',
    'PostgreSQL',
    'Redis',
    'Three.js',
    'Vite',
    'Docker',
    'CI/CD',
  ],

  experience: [
    {
      period: '2021 — Present',
      company: 'EXANTE',
      role: 'Senior Full-Stack Engineer',
      location: 'Limassol · Remote',
      summary: 'Trading and brokerage platform for a global fintech.',
      bullets: [
        'Built and maintained TypeScript React interfaces for high-throughput trading workflows.',
        'Owned Node.js services and GraphQL APIs powering real-time market data.',
        'Drove front-end performance and reliability work across the platform.',
      ],
    },
    {
      period: '2018 — 2021',
      company: 'Admitad',
      role: 'Senior Frontend Engineer',
      location: 'Moscow · Remote',
      summary: 'Affiliate-marketing network operating at large scale.',
      bullets: [
        'Led front-end development for partner-facing dashboards and analytics.',
        'Introduced a typed component system that cut UI defects and ramp time.',
        'Partnered with backend teams on API design for reporting at scale.',
      ],
    },
    {
      period: '2014 — 2018',
      company: '2GIS',
      role: 'Frontend Developer',
      location: 'Novosibirsk',
      summary: 'City mapping and local-business discovery products.',
      bullets: [
        'Developed interactive map UIs serving millions of monthly users.',
        'Optimised rendering and bundle size for low-end devices.',
        'Shipped reusable UI primitives adopted across product teams.',
      ],
    },
    {
      period: '2012 — 2014',
      company: 'Wow',
      role: 'Frontend Developer',
      location: 'Tomsk',
      summary: 'Early-career web product and agency work.',
      bullets: [
        'Built responsive marketing sites and web applications from scratch.',
        'Established front-end conventions and a shared component toolkit.',
        'Learned to ship end to end — design hand-off through deployment.',
      ],
    },
  ],

  projects: [
    {
      title: 'its.events',
      blurb: 'A catalog of IT conferences and meetups, with talks imported and curated into a searchable archive.',
      href: 'https://its.events',
      repo: 'its.events',
    },
    {
      title: 'karmanov.ws',
      blurb: 'This site — an Astro + react-three-fiber personal page with a live GitHub-powered projects section.',
      href: 'https://karmanov.ws',
      repo: 'karmanov.ws',
    },
    {
      title: 'ts-utils',
      blurb: 'A small, dependency-free TypeScript utility library focused on type-safe ergonomics.',
      href: 'https://github.com/HawkeyePierce89/ts-utils',
      repo: 'ts-utils',
    },
    {
      title: 'react-hooks',
      blurb: 'A collection of well-tested, reusable React hooks extracted from production work.',
      href: 'https://github.com/HawkeyePierce89/react-hooks',
      repo: 'react-hooks',
    },
    {
      title: 'dotfiles',
      blurb: 'My development environment — shell, editor and tooling configuration, kept reproducible.',
      href: 'https://github.com/HawkeyePierce89/dotfiles',
      repo: 'dotfiles',
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
    heroVariant: 'blob',
  },
};

export default content;
