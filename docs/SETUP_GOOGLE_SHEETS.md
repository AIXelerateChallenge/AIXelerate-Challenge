# Forms and email delivery

The site posts student and mentor applications from `/apply`, and enquiries from
`/contact`, to the Google Apps Script URL in `src/data/forms.js`.
`apps-script/Code.gs` saves submissions in separate Student, Mentor, and Contact
sheet tabs and sends a notification to **vishakh.a@aixeleratechallenge.org**.
Replies go to the visitor's email address. No Outlook integration is needed.

## Update the existing deployment

1. Open the Google Sheet connected to the existing forms, then **Extensions → Apps Script**.
2. Replace the script with the contents of `apps-script/Code.gs` and save.
3. Authorize the script's spreadsheet and email permissions using the deployment owner's account.
4. Choose **Deploy → Manage deployments → Edit → New version → Deploy**.
   Run as the owner and allow access to **Anyone** so visitors can submit.
   Updating the existing deployment preserves the URL already in the site.
5. If Google issues a different deployment URL, update `WEB_APP_URL` in
   `src/data/forms.js` and rebuild the site.

Saving the script alone does not update the deployed endpoint. The old script
does not accept contact enquiries or send email notifications.

## Verify after deployment

- Submit one clearly marked test enquiry with a reply address you control.
- Confirm a Contact row appears and the notification arrives at Vishakh's inbox.
- Confirm Reply addresses the submitter, then check a student and mentor application.
- Check each homepage pathway preselects the intended contact topic.

Local automated checks use mocks and do not send real email. Delivery to the
inbox still needs verification after deployment.

## Failure handling and access

Submissions are saved before email is attempted. If email delivery fails, the
contact page reports that the message was saved and offers the direct email
address. Check the sheet and Apps Script execution logs for notifications that
could not be sent.

The optional `TOKEN` is for server-side exports only. With a blank token the GET
endpoint denies access; never place an export token in the public site.
Use the Google Sheet directly to review submissions.

When adding fields, update both the form and `SHEET_CONFIG`. Preserve the column
order of existing tabs or migrate their headers and rows before deploying.
