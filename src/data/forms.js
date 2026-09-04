/**
 * Form definitions. Field `name` values are the contract with Code.gs —
 * SHEET_CONFIG there writes columns in this exact order, so renaming a
 * field here without updating the Apps Script will silently drop data.
 *
 * Student sheet: name, email, grade, school, experience, teamStatus, idea, referral
 * Mentor  sheet: name, email, org, title, expertise, availability, link, why
 */

export const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbynQ2t5cI1YZvvZTwElpPIVBpSSQZWAhuDQhuglAOrvoD2kMPCzNOMCUl87OsKgQY-TDA/exec';

export const studentFields = [
  { type: 'text',   name: 'name',   label: 'Full name', placeholder: 'Jordan Lee', required: true, half: true },
  { type: 'email',  name: 'email',  label: 'Email', placeholder: 'you@email.com', required: true, half: true },
  {
    type: 'select', name: 'grade', label: 'Grade level', required: true, half: true,
    options: ['9th grade', '10th grade', '11th grade', '12th grade'],
  },
  { type: 'text',   name: 'school', label: 'School', placeholder: "Your school's name", half: true },
  {
    type: 'radio', name: 'experience', label: 'Experience level',
    options: ['New to coding', 'Some experience', 'Experienced'],
  },
  {
    type: 'radio', name: 'team-status', label: 'Team status',
    options: ['Have a team', 'Looking for a team', 'Not sure yet'],
  },
  {
    type: 'textarea', name: 'idea', label: 'What do you want to build?',
    placeholder: 'A rough idea is fine — this only helps us match you with the right mentor.',
  },
  {
    type: 'text', name: 'referral', label: 'How did you hear about us?',
    placeholder: 'Friend, school, Instagram…', optional: true,
  },
];

export const mentorFields = [
  { type: 'text',  name: 'name',  label: 'Full name', placeholder: 'Jordan Lee', required: true, half: true },
  { type: 'email', name: 'email', label: 'Email', placeholder: 'you@email.com', required: true, half: true },
  { type: 'text',  name: 'org',   label: 'Company / organisation', placeholder: 'Where you work or study', half: true },
  { type: 'text',  name: 'title', label: 'Role / title', placeholder: 'e.g. Software Engineer', half: true },
  {
    type: 'checkbox', name: 'expertise', label: 'Areas of expertise',
    options: ['AI / ML', 'Web development', 'Product / design', 'Ethics & policy', 'Other'],
  },
  {
    type: 'select', name: 'availability', label: 'Availability', required: true,
    options: ['A few hours total', 'Weekly check-ins', 'Full sprint days'],
  },
  { type: 'url',      name: 'link', label: 'LinkedIn or portfolio', placeholder: 'https://', optional: true },
  { type: 'textarea', name: 'why',  label: 'Why do you want to mentor?', placeholder: 'A couple of sentences is plenty.' },
];
