[Table of contents](../readme.md) / [Operations](./index.md)

# Deleting users

Occassionally people request that their account gets deleted on Spectrum. We have a safe way to do this so that it respects the integrity of data across the rest of the database.

**Do NOT ever `.delete()` a user record from the database!!**

Follow these steps to safely delete a user from Spectrum:

1. Find the user in the database and **write down their user id** 
2. Check to see if the user owns any communities.
  2a. If the user owns communities, please try to convince them not to delete their account.
  2b. If they *really* want to delete their account, reach out to @brian to handle this
3. When it's confirmed that they don't own any communities, clear all necessary fields from the user record, and add a `deletedAt` field - this will trigger Vulcan to remove the user from search indexes
```
r.db('spectrum')
.table('users')
.get(ID)
.update({
  username: null,
  email: null,
  deletedAt: new Date(),
  providerId: null,
  fbProviderId: null,
  googleProviderId: null,
  githubProviderId: null,
  githubUsername: null,
  profilePhoto: null,
})
```
4. Remove that user as a member from all communities and channels:
```
// usersCommunities
.table('usersCommunities')
.getAll(ID, { index: 'userId' })
.update({
  isMember: false,
  receiveNotifications: false
})

// usersChannels
.table('usersChannels')
.getAll(ID, { index: 'userId' })
.update({
  isMember: false,
  receiveNotifications: false,
})
```
5. Remove all notifications from threads to save worker processing:
```
// usersThreads
.table('usersThreads')
.getAll(ID, { index: 'userId' })
.update({
  receiveNotifications: false,
})
```
6. Done! The user now can't be messaged, searched for, or re-logged into. The deleted user no longer affects community or channel member counts, and will not ever get pulled into Athena for notifications processing.