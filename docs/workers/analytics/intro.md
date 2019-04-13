[Table of contents](../../readme.md) / [Workers](../intro.md)

# Analytics

The Analytics worker is responsible for helping us process actions happening on Spectrum so that we can make better decisions about product development, usage, and failures. Event tracking is abstracted to allow any number of downstream providers (including future first-party pipelines) to all process the same events.

All event tracking is anonymized completely, ensuring that an individual user’s actions cannot be replayed and tracked back to a single person. This anonymization happens in two places:

1. On the client, when a user is identified, we hash the userId using `sha1` via the anonymizomatic microservice.
2. In the worker, every identify call has the userId automatically hashed before being dispatched to downstream analytics providers

Analytics is built to read off of our [Redis queue](../background-jobs.md). This allows any worker to dispatch jobs to be processed asynchronously in the worker - we currently do this from the api, Hermes, and Athena.