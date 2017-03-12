# Database Rules

The Firebase realtime database security rules we use for Spectrum.

## Setup locally

```sh
git clone git@github.com:withspectrum/database-rules.git
cd database-rules
# Initialise the project with Firebase
firebase use
```

> Note: This requires you to have [`firebase-tools`](https://github.com/firebase/firebase-tools) installed.

## Deployment

**DO NOT DEPLOY YOUR CHANGES DIRECTLY**

Submit changes to rules as PRs, and when they are merged to `master` do a `git pull origin master` and then run `firebase deploy`.
