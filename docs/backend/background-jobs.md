# Background jobs

We use [`bull`](https://github.com/OptimalBits/bull) for all of our background job needs. (at the moment that mostly means notification processing and emails) `bull` uses redis under the hood (see docs/setup.md for instructions on how to install redis) to store information about these jobs.

All of our servers and workers connect to the same redis instance, adding and taking jobs as they see fit. (in development that's your local instance, in production that's a remote instance hosted on compose.com) Thusly, redis acts kind of like shared global state that helps our disparate processes talk to each other.

Because `bull` implements job locking we can run as many of these servers and workers in parallel without any job getting done more than one time, which is very neat and should help us a lot when we run into scaling problems.
