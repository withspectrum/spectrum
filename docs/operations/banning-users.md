[Table of contents](../readme.md) / [Operations](./index.md)

# Banning users

Occassionally bad actors will show up on Spectrum and become toxic, spam communities, harass others, or violate our code of conduct. We have a safe way to ban these users in a way that respects the integrity of data across the rest of the database.

**Do NOT ever `.delete()` a user record from the database!!**

Follow these steps to safely ban a user from Spectrum:

1. Find the user in the database
2. Update the user with the following fields:
```js
r.db('spectrum')
.table('users')
.get(ID)
.update({
  bannedAt: new Date(),
  bannedBy: YOUR_USER_ID,
  bannedReason: "Reason for ban here"
})
```
3. Disable paid feature flags for communities owned by the user.
```js
.table('communities')
.filter(function (community) {
  return r.db('spectrum')
    .table('usersCommunities')
    .getAll(ID, { index: 'userId' })
    .filter(function (userCommunity) {
      return userCommunity('communityId').eq(community('id'))
        .and(userCommunity('isOwner').eq(true))
    })
    .count().gt(0)
})
.update({
  analyticsEnabled: false,
  prioritySupportEnabled: false,
})
```

4. Archive all private channels in communities owned by the user

```js
.table('channels')
.filter(function (channel) {
  return r.db('spectrum')
    .table('usersCommunities')
    .getAll(ID, { index: 'userId' })
    .filter(function (userCommunity) {
      return userCommunity('communityId').eq(channel('communityId'))
        .and(userCommunity('isMember').eq(true))
    })
    .count().gt(0)
    .and(channel('isPrivate').eq(true))
})
.update({ archivedAt: new Date() })
```

5. Remove that user as a member from all communities and channels:
```js
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
6. Remove all notifications from threads to save worker processing:
```js
// usersThreads
.table('usersThreads')
.getAll(ID, { index: 'userId' })
.update({
  receiveNotifications: false,
})
```
7. Reset the person's notification settings so they will not get any future emails about DMs, daily digests, etc
```js
// usersSettings
.table('usersSettings')
.getAll(ID, { index: 'userId' })
.update({
  notifications: {
    types: {
      dailyDigest: {
        email: false
      },
      newDirectMessage: {
        email: false
      },
      newMention: {
        email: false
      },
      newMessageInThreads: {
        email: false
      },
      newThreadCreated: {
        email: false
      },
      weeklyDigest: {
        email: false
      }
    }
  }
})
```
8. Done! The user now can't be messaged, searched for, or re-logged into. The banned user no longer affects community or channel member counts, and will not ever get pulled into Athena for notifications processing.