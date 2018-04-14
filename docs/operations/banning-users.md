[Table of contents](../readme.md) / [Operations](./index.md)

# Banning users

Occassionally bad actors will show up on Spectrum and become toxic, spam communities, harass others, or violate our code of conduct. We have a safe way to ban these users in a way that respects the integrity of data across the rest of the database.

**Do NOT ever `.delete()` a user record from the database!!**

Follow these steps to safely ban a user from Spectrum:

1. Find the user in the database
2. Update the user with the following fields:
```
r.db('spectrum')
.table('users')
.get(ID)
.update({
  bannedAt: new Date(),
  bannedBy: YOUR_USER_ID,
  bannedReason: "Reason for ban here"
})
```
4. Remove that user as a member from all communities and channels:
```
// usersCommunities
.table('usersCommunities')
.getAll(ID, { index: 'userId' })
.update({
  isOwner: false,
  isModerator: false,
  isMember: false,
  receiveNotifications: false
})

// usersChannels
.table('usersChannels')
.getAll(ID, { index: 'userId' })
.update({
  isOwner: false,
  isModerator: false,
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
6. Done! The user now can't be messaged, searched for, or re-logged into. The banned user no longer affects community or channel member counts, and will not ever get pulled into Athena for notifications processing.