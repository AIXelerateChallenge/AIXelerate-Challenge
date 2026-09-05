/**
 * Single source of truth for site-wide facts, navigation, and external
 * links. Every page reads from here — no more editing six HTML files to
 * change one nav label.
 */

export const site = {
  name: 'AIXelerate Challenge',
  tagline:
    'A free AI build sprint for high schoolers who would rather ship an idea than perfect a prompt.',
  email: 'hello@aixeleratechallenge.org', // TODO: confirm the real address
};

export const nav = [
  { href: '/mission', label: 'Mission' },
  { href: '/about',   label: 'About' },
  { href: '/events',  label: 'Events' },
];

export const cta = {
  student: { href: '/apply?role=student', label: 'Apply as a student' },
  mentor:  { href: '/apply?role=mentor',  label: 'Mentor a team' },
};

/**
 * External destinations. The previous site left every one of these as
 * href="#" — they are marked here so they are findable in one place.
 */
export const links = {
  donate:      { href: '#', label: 'Give to AIXelerate',  todo: true },
  sponsor:     { href: '#', label: 'Sponsor a sprint',    todo: true },
  instagram:   { href: '#', label: 'Instagram',           todo: true },
  hackClub:    { href: 'https://hackclub.com', label: 'Hack Club', todo: false },
  hcb:         { href: 'https://hcb.hackclub.com', label: 'HCB', todo: false },
};

/** First-sprint facts supplied by the AIXelerate team. */
export const stats = [
  { value: '80+',     count: 80,   prefix: '',  suffix: '+', label: 'Sign-ups', note: 'first sprint, one month of planning' },
  { value: '$5,000+', count: 5000, prefix: '$', suffix: '+', label: 'Raised',   note: 'to make the event completely free' },
  { value: '5',       count: 5,    prefix: '',  suffix: '',  label: 'Sponsors', note: 'backing the July 2026 sprint' },
];

export const fiscal = {
  ein: '81-2908499',
  sponsorName: 'The Hack Foundation (d.b.a. Hack Club)',
};
