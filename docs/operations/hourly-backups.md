# Hourly Off-site Backups

In order to avoid more data loss we implemented hourly off-site backups in [#5150](https://github.com/withspectrum/spectrum/pull/5150). While the implementation is simple, it should cover us well enough.

It works by running two cron jobs:

1. Runs at 30 minutes past every hour and triggers an "on-demand backup" with our database host (Compose)
2. Runs at 0 minutes past every hour, fetches the latest "on-demand backup" from our database host and uploads it to our S3 bucket

To access the latest hourly backup you can either go to the Compose dashboard (app.compose.com), navigate to the RethinkDB deployment and download the newest on-demand backup, or open our S3 bucket and download the latest one from there.
