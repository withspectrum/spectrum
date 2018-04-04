# Pluto

*Pluto was the ruler of the underworld in classical mythology*

Pluto is our payments worker. Its job is to keep our server in sync with Stripe, our payments processor. We do this in two key ways: webhooks and changefeeds.

### Understanding Pluto

One of the key problems we attempted to solve with Pluto was: *how do we keep the state of our paid features in sync with our payment records on Stripe?* When evaluating this problem, we knew that we did not want to be requesting data from Stripe every time a user requested a paid feature field on the frontend. We also did not want to have to maintain our own copy of the data with significant transformations, making it easier for our dataset to come out of sync with Stripe. The implementation we landed on is to: first, default to reading off of our database via the `stripeCustomers` table. Second, if no record exists on our end, fetch it and store it from Stripe. And finally, let any event on Stripe automatically update our data as a reflection of the source of truth.

### Webhooks

Whenever any kind of payment related event happens on Stripe it sends data to Pluto via webhooks. This data comes in and is filtered by type to determine how it should be handled. The key goal of webhooks is to use the incoming data as a signal that *the source of truth on Stripe has changed, and we need to sync*. Therefore, most inbound events simply trigger an update in our database of some original document coming in from Stripe.

### Changefeeds

Pluto takes advantage of RethinkDB's [changefeeds](https://rethinkdb.com/docs/changefeeds/javascript/) feature to listen for new documents, changed documents, and deleted documents in our database to signal that a payments event has occured.

### Coming together

Pluto reads and writes off of our [Redis queue](../background-jobs.md) to process jobs from both webhooks and changefeeds.