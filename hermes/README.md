# Sending emails with Hermes

In an effort to maintain consistency across our emails, please following the following guidelines:

1. Abort all repeating emails that do not have an `unsubscribeToken` in the email's TemplateModel
2. All email TemplateModels should have the following data shape:

```
{
  to: string!,
  subject: string!,
  preheader: string!,
  recipient: {
    username: string!
  },
  unsubscribeToken: string,
  data: mixed
}
```

To break down these fields:

`to` => the recipient's email address
`subject` => always calculate subject strings inside of Hermes for consistency, even if it is a static string
`preheader` => represents the "email preview" that gets displayed in email clients and push notifications. The content of this string is meant to draw users into the email, but **will not** be displayed in the email body itself
`recipient` => contains user data about the person receiving the email. The only field that is absolutely required is the `username` field. If a `username` field does not exist for the recipient, the email should always be aborted. The `username` is used to link to the user's notification preferences, and if it doesn't exist they have no way to change their preferences.
`unsubscribeToken` => this is a required field for all *repeating* emails. A repeating email is one that a user might receive regularly based on actions taken by others on Spectrum. Examples include: new direct message notifications, new thread notifications. The `unsubscribeToken` is *not required* for non-repeating emails, which should be one-off emails like receipts, community invitations, email validations, etc.
`data` => can contain any abstract data needed for the email to render its body content.