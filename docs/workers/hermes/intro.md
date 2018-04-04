# Hermes

*Hermes (/ˈhɜːrmiːz/) is the messenger god, moving between the worlds of the mortal and the divine.*

Hermes is our email worker. Hermes reads off of our [Redis queue](../background-jobs.md) to process email content and deliver emails via [Postmark](https://postmarkapp.com/). Hermes is responsible for formatting content before it enters the email templates, but does not have a connection to the database, so all inbound jobs should contain all the required data for the final email.

