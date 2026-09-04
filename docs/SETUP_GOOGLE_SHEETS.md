# Connecting join.html to Google Sheets

This turns your Google Sheet into the backend for all four registration
forms — no server hosting required. Takes about 10 minutes.

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet.
2. Name it something like **AIXelerate Challenge — Registrations**.
3. You don't need to add any tabs or headers yourself — the script creates
   them automatically the first time each form is submitted.

## 2. Add the script

1. In the Sheet, go to **Extensions > Apps Script**.
2. Delete the placeholder code in `Code.gs`.
3. Paste in the full contents of the `Code.gs` file provided alongside this
   guide.
4. (Optional but recommended once you're live) Set a shared secret so random
   people can't read your submissions if they guess your URL:
   - In `Code.gs`, change `const TOKEN = "";` to something like
     `const TOKEN = "aix2026-9f2k";` — any string you like.
   - You'll paste this same value into `join.html` in step 4.
5. Click the **Save** icon (or Ctrl/Cmd+S).

## 3. Deploy as a Web App

1. Click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. "Registrations API"
   - **Execute as:** Me (your account)
   - **Who has access:** Anyone
4. Click **Deploy**.
5. The first time, Google will ask you to authorize the script — click
   through the "Google hasn't verified this app" warning (this is normal for
   scripts you write yourself): **Advanced > Go to [project name] (unsafe) >
   Allow**.
6. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

   Keep this — you'll paste it into `join.html` next.

> **If you ever edit `Code.gs` later:** you must create a **New deployment**
> (or use "Manage deployments" > edit > new version) for changes to take
> effect. Just saving the script is not enough.

## 4. Connect join.html

Open `join.html` and find this near the top of the `<script>` block:

```js
const SHEETS_CONFIG = {
  webAppUrl: "",     // paste your Apps Script Web App URL here
  sharedToken: ""    // must match TOKEN in Code.gs, if you set one
};
```

Paste your Web app URL and (if you set one) your token:

```js
const SHEETS_CONFIG = {
  webAppUrl: "https://script.google.com/macros/s/AKfycb.../exec",
  sharedToken: "aix2026-9f2k"
};
```

Save and re-upload `join.html` to your host. That's it — submissions will
now:
- Save instantly to the visitor's browser (as before, for the local
  dashboard/offline case), **and**
- Get sent to your Google Sheet in the background.

## 5. Try it

1. Open your live `join.html`, submit a test entry in each of the 4 tabs.
2. Check your Google Sheet — you should see new tabs appear (Competitor,
   Volunteer, Mentor/Judge, Board Member) with your test rows.
3. On the page, click **View Saved Responses** — it will now pull live data
   from the Sheet (falling back to local-only data if the Sheet can't be
   reached, e.g. you haven't deployed yet).

## Notes & limits

- **Free, no server to maintain.** Apps Script runs on Google's
  infrastructure.
- **Quota:** Free Google accounts get generous daily quotas (well beyond
  what a hackathon registration page needs — thousands of requests/day).
- **Security:** the shared token is basic obscurity, not real
  authentication. Don't put anything highly sensitive in these forms. For
  real access control, you'd want a proper backend with authentication.
- **Editing columns:** if you add a new form field later, add its name to
  the matching array in `SHEET_CONFIG` inside `Code.gs` (order = column
  order), redeploy, and it'll start showing up as a new column.
- **CSV export still works** the same way as before, from local data.
