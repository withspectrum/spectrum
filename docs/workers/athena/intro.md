[Table of contents](../../readme.md) / [Workers](../intro.md)

# Athena

*Athena (/əˈθiːnə/) is the goddess of wisdom, craft, and war.*

Athena is our notifications worker, processing things like new message notifications, new thread notifications, new member notifications, etc. Athena is built to read off of our [Redis queue](../background-jobs.md). Most queues in Athena handle the sending of both in-app notifications as well as email notifications (by dispatching a new job to the Redis queue for [Hermes](../hermes/intro.md) to read).

This server also does the heavy lifting of keeping track of the `lastSeen` field on `usersThreads`, which is what powers the small 'New Messages' badge that users see when viewing threads on Spectrum. While not directly a notification, the `lastSeen` field is a critical piece of Spectrum that helps people keep up with the most important and active conversations in their communities.