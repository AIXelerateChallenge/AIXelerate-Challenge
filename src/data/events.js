/**
 * Event record. Facts here are carried over verbatim from the previous
 * site — sign-ups, sponsors, judges, and the vibes.diy credit are all
 * as originally stated. Do not add numbers that are not sourced.
 */

export const events = [
  {
    slug: 'july-2026-build-sprint',
    n: '01',
    title: 'July Build Sprint',
    date: 'July 2026',
    kind: 'Build Sprint',
    status: 'complete',
    summary:
      'The first event AIXelerate ever ran, planned in about a month.',
    body: [
      'The AIXelerate 2026 Build Sprint in July was the first event held by the AIXelerate Organization. In roughly one month of planning we brought in over 80 sign-ups, 5 sponsors, and 3 judges.',
      'Every participating student was given $50 of Claude credit through vibes.diy, so that compute cost was never the thing standing between an idea and a working prototype.',
    ],
    facts: [
      { k: 'Sign-ups', v: '80+' },
      { k: 'Sponsors', v: '5' },
      { k: 'Judges',   v: '3' },
      { k: 'Credit per student', v: '$50' },
    ],
    gallery: [
      { src: '/images/aix1.jpg', alt: 'Students working together at the July 2026 build sprint.' },
      { src: '/images/aix2.jpg', alt: 'A team presenting their project to judges.' },
      { src: '/images/aix3.jpg', alt: 'Mentors reviewing a team’s architecture.' },
      { src: '/images/aix4.jpg', alt: 'Participants collaborating during the build hours.' },
      { src: '/images/aix5.jpg', alt: 'The sprint room during final demos.' },
    ],
  },
];
