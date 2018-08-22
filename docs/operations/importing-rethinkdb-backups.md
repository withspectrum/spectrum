[Table of contents](../readme.md) / [Operations](./index.md)

# Importing production data locally

Sometimes it's useful to have production data running locally in rethinkdb for debugging and testing. To get production data running locally, follow these steps:

1. Go to http://localhost:8080/#tables and delete the local 'spectrum' table
2. Log in to the Space Program AWS console
3. Go to S3 > Spectrum Backups > Hourly
4. Download the latest backup .tar.gz
5. Unzip that backup onto your desktop
6. Rename the unzipped directory to 'prod-backup'
6. In your terminal, run: `cd ~/Desktop && rethinkdb import -d prod-backup`
7. The import will take a couple hours, at which point you can clear localstorage at localhost:3000 to re-authenticate
