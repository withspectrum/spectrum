[Table of contents](../../readme.md) / [Workers](../intro.md)

# Chronos

*Chronos (/ˈkroʊnɒs/) is the personification of Time in pre-Socratic philosophy*

Chronos powers all the cron jobs needed to run Spectrum. These jobs currently include:

- daily and weekly digest emails for Spectrum users
- daily core metrics reports for the Spectrum team

Any recurring jobs should go here. Chronos also runs off of our [Redis queue](../background-jobs.md) which handles the cron schedule, job locking, and retry logic.