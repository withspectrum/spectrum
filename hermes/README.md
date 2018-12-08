# Sending emails with Hermes

In an effort to maintain consistency across our emails, please following the following guidelines:

1. Abort all emails that do not have an `unsubscribeToken` in the email's dynamic_template_data
2. Abort all emails that are being sent to a user without a username - they probably aren't active.
3. All email templates must have their css inlined before being added to SendGrid. SendGrid does *not* automatically inline the css. To do this, follow the following steps:

- Make sure you have python3 installed: `brew install python3`
- Install `premailer` with python3: `sudo python3 -m pip install premailer`
- Run the script in `python-scripts` dir: `python3 python-scripts/inline-html-emails.py`

This will iterate through each email template, inline the css, and save the final version in `./built-email-templates` - from this directory, you can grab the html to add to SendGrid.