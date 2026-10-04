import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');
function backend({ mailFails = false, sheetFails = false } = {}) {
  const sheets = new Map();
  const mail = [];
  const context = {
    console: { error() {} },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({
      getSheetByName: name => sheets.get(name),
      insertSheet: name => {
        const rows = [];
        const sheet = { rows, appendRow(row) { if (sheetFails) throw new Error('Unavailable'); rows.push(row); }, setFrozenRows() {} };
        sheets.set(name, sheet);
        return sheet;
      },
    }) },
    MailApp: { sendEmail(message) { if (mailFails) throw new Error('Quota'); mail.push(message); } },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
  };
  runInNewContext(source, context);
  return { sheets, mail, post: data => context.doPost({ postData: { contents: JSON.stringify(data) } }), get: () => context.doGet({ parameter: {} }) };
}
const contact = { formType: 'contact', name: 'Example Person', email: 'person@example.com', topic: 'Start a school club', schoolOrCity: 'Example School', message: 'Can we start a club?', website: '' };

test('each contact pathway saves to Contact and notifies the requested inbox with reply-to', () => {
  for (const topic of ['Join an online cohort', 'Start a school club', 'Host a hackathon', 'Sponsor a sprint', 'Talk with the team']) {
    const app = backend();
    const result = app.post({ ...contact, topic });
    assert.equal(result.ok, true);
    assert.equal(result.notified, true);
    assert.equal(app.sheets.get('Contact').rows.length, 2);
    assert.equal(app.sheets.get('Contact').rows[1][3], topic);
    assert.equal(app.mail[0].to, 'vishakh.a@aixeleratechallenge.org');
    assert.equal(app.mail[0].replyTo, contact.email);
    assert.match(app.mail[0].body, /Can we start a club/);
  }
});
test('legacy student and mentor payloads still save and notify', () => {
  const app = backend();
  assert.equal(app.post({ name: contact.name, email: contact.email, grade: '11th grade', 'team-status': 'Looking for a team' }).ok, true);
  assert.equal(app.sheets.get('Student').rows[1][6], 'Looking for a team');
  assert.equal(app.post({ name: contact.name, email: contact.email, org: 'Example', title: 'Engineer', expertise: 'AI / ML, Product / design' }).ok, true);
  assert.equal(app.sheets.get('Mentor').rows[1][5], 'AI / ML, Product / design');
  assert.equal(app.mail.length, 2);
});
test('mail failure preserves the submission and accurately reports notification failure', () => {
  const app = backend({ mailFails: true });
  const result = app.post(contact);
  assert.equal(result.ok, true);
  assert.equal(result.notified, false);
  assert.equal(app.sheets.get('Contact').rows.length, 2);
});
test('storage failure does not report success or send email', () => {
  const app = backend({ sheetFails: true });
  assert.equal(app.post(contact).ok, false);
  assert.equal(app.mail.length, 0);
});
test('invalid or spam submissions are rejected before storage or notification', () => {
  for (const data of [null, [], { ...contact, name: '' }, { ...contact, email: 'bad' }, { ...contact, email: 'a@example.com\nBcc:other@example.com' }, { ...contact, topic: 'invalid' }, { ...contact, message: ' ' }, { ...contact, website: 'spam' }, { ...contact, message: 'a'.repeat(10001) }]) {
    const app = backend();
    assert.equal(app.post(data).ok, false);
    assert.equal(app.sheets.size, 0);
    assert.equal(app.mail.length, 0);
  }
});
test('spreadsheet formulas are stored as literal text', () => {
  const app = backend();
  app.post({ ...contact, message: '=IMPORTDATA("https://example.com")' });
  assert.equal(app.sheets.get('Contact').rows[1][5][0], "'");
  assert.match(app.mail[0].body, /message: =IMPORTDATA/);
});
test('public reads cannot expose submissions when no export token is configured', () => {
  assert.equal(backend().get().ok, false);
});
