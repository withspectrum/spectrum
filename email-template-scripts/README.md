# Syncing Email Templates with SendGrid

All email templates must have their CSS inlined before being added to SendGrid. SendGrid does *not* automatically inline the CSS. Additionally, to save time while testing email template changes it is tedious to copy/paste templates between a code editor and the SendGrid UI, with the CSS-inlining script being required to run with each modification.

The scripts in this directory solve both of these problems. To get started:

- Make sure you have python3 installed: `brew install python3`
- Install `premailer` with python3: `sudo python3 -m pip install premailer`

From the root directory of the Spectrum repo, run:
`SENDGRID_API_KEY=<key> yarn run process:emails:test`
You will need a `SENDGRID_API_KEY` from the SendGrid app for this to work.

The `:test` script inlines all the CSS for each email template then syncs it with the `[Test]` template on SendGrid. When done testing your changes, you can sync both test and production templates by running:
`SENDGRID_API_KEY=<key> yarn run process:emails:prod`

# Sending test emails

Rather than spinning up the local web app, clicking around and trying to replicate each email's conditions, you can instead run the `send-test-emails` script:

`SENDGRID_API_KEY=<key> yarn run process:emails:send`

**Be sure to edit the email address in `package.json` first**