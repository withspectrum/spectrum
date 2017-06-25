# `hermes`: The email worker

`hermes` is our background worker responsible for sending emails. It implements some `bull` queues (see docs/background-jobs.md) that can be contacted to send transactional (!) emails with Postmark.
