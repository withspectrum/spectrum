# Sending emails with Hermes

In an effort to maintain consistency across our emails, please following the following guidelines:

1. Abort all emails that do not have an `unsubscribeToken` in the email's dynamic_template_data
2. Abort all emails that are being sent to a user without a username - they probably aren't active.
3. Pre-process and upload to SendGrid via the local syncing script. See `email-template-scripts/README.md`.