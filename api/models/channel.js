// -@-f-l-o-w
const { db } = require('shared/db');
import { sendChannelNotificationQueue } from 'shared/bull/queues';
import type { DBChannel } from 'shared/types';
const mongodb = require('mongodb');

// reusable query parts -- begin
// const channelsByCommunitiesQuery = (...communityIds: string[]) =>
//   db
//     .table('channels')
//     .getAll(...communityIds, { index: 'communityId' })
//     .filter(channel => channel.hasFields('deletedAt').not());
const channelsByCommunitiesQuery = async (...communityIds) => {
  return db.collection('channels').aggregate([
    {
      $match: {
        communityId: { $in: communityIds },
        deletedAt: null,
      },
    },
  ]);
};

// const channelsByIdsQuery = (...channelIds: string[]) =>
//   db
//     .table('channels')
//     .getAll(...channelIds)
//     .filter(channel => channel.hasFields('deletedAt').not());
const channelsByIdsQuery = async (...channelIds) => {
  return (await db
    .collection('channels')
    .find({})
    .toArray())
    .filter(channel => {
      return channelIds.includes(channel.id);
    })
    .filter(channel => {
      return !channel.deletedAt;
    });
};

// const threadsByChannelsQuery = (...channelIds: string[]) =>
//   channelsByIdsQuery(...channelIds)
//     .eqJoin('id', db.table('threads'), { index: 'channelId' })
//     .map(row => row('right'))
//     .filter(thread => db.not(thread.hasFields('deletedAt')));
const threadsByChannelsQuery = async (...channelIds) => {
  return (await channelsByIdsQuery(...channelIds))
    .map(async channel => {
      return (await db
        .collection('threads')
        .find({})
        .toArray())
        .filter(thread => {
          return thread.channelId == channel.id;
        })
        .map(thread => {
          return { left: channel, right: thread };
        });
    })
    .reduce((previousValue, currentValue) => {
      return [...previousValue, ...currentValue];
    }, [])
    .map(row => {
      return row.right;
    })
    .filter(thread => {
      return !thread.deletedAt;
    });
};

// const membersByChannelsQuery = (...channelIds: string[]) =>
//   channelsByIdsQuery(...channelIds)
//     .eqJoin('id', db.table('usersChannels'), { index: 'channelId' })
//     .map(row => row('right'))
//     .filter({ isBlocked: false, isPending: false, isMember: true });
const membersByChannelsQuery = async (...channelIds) => {
  return (await channelsByIdsQuery(channelIds))
    .map(async channel => {
      return (await db
        .collection('usersChannels')
        .find({})
        .toArray())
        .filter(usersChannel => {
          usersChannel.channelId == channel.id;
        })
        .map(usersChannel => {
          return { left: channel, right: usersChannel };
        });
    })
    .reduce((previousValue, currentValue) => {
      return [...previousValue, ...currentValue];
    }, [])
    .map(row => {
      return row.right;
    })
    .filter(usersChannel => {
      return (
        usersChannel.isBlocked == false &&
        usersChannel.isPending == false &&
        usersChannel.isMember == true
      );
    });
};

// reusable query parts -- end

// prettier-ignore
// const getChannelsByCommunity = (communityId: string): Promise<Array<DBChannel>> => {
//   return channelsByCommunitiesQuery(communityId).run();
// };
const getChannelsByCommunity = async (communityId: string): Promise<Array<DBChannel>> => {
  return await channelsByCommunitiesQuery(communityId)
};

/*
  If a non-user is viewing a community page, they should only see threads
  from public channels. We use this function to return an array of channelIds
  that are public, and pass them into a getThreads function
*/
// prettier-ignore
// const getPublicChannelsByCommunity = (communityId: string): Promise<Array<string>> => {
//   return channelsByCommunitiesQuery(communityId)
//     .filter({ isPrivate: false })
//     .filter(row => row.hasFields('archivedAt').not())
//     .map(c => c('id'))
//     .run();
// };
const getPublicChannelsByCommunity = async (communityId: string): Promise<Array<string>> => {  
  return (await channelsByCommunitiesQuery(communityId))
    .filter(channel => {
      return channel.isPrivate == false
    })
    .filter(row => {
      return !row.archivedAt
    })
    .map(c => {
      return c.id
    })
};

/*
  If a user is viewing a community, they should see threads from all public channels as well as from private channels they are a member of.

  This function returns an array of objects with the field 'id' that corresponds
  to a channelId. This array of IDs will be passed into a threads method which
  will only return threads in those channels
*/
// prettier-ignore
// const getChannelsByUserAndCommunity = async (communityId: string, userId: string): Promise<Array<string>> => {
//   const channels = await channelsByCommunitiesQuery(communityId).run();
//   const unarchived = channels.filter(channel => !channel.archivedAt)
//   const channelIds = unarchived.map(channel => channel.id)

//   return db
//     .table('usersChannels')
//     .getAll(...channelIds.map(id => ([userId, id])), {
//       index: 'userIdAndChannelId',
//     })
//     .filter({ isMember: true })('channelId')
//     .run();
// };
const getChannelsByUserAndCommunity = async (communityId: string, userId: string): Promise<Array<string>> => {
  const channels = await channelsByCommunitiesQuery(communityId);
  const unarchived = channels.filter(channel => !channel.archivedAt);
  const channelIds = unarchived.map(channel => channel.id);

  return (await db.collection("usersChannels")
    .find({})
    .toArray())
    .filter(usersChannel => {
      return usersChannel.userId == userId 
        && channelIds.includes(usersChannel.channelId)
    })
    .filter(usersChannel => {
      return usersChannel.isMember == true
    })
    .map(usersChannel => {
      return usersChannel.channelId
    })
};

// const getChannelsByUser = async (userId: string): Promise<Array<DBChannel>> => {
//   return db
//     .table('usersChannels')
//     .getAll([userId, 'member'], [userId, 'moderator'], [userId, 'owner'], {
//       index: 'userIdAndRole',
//     })
//     .eqJoin('channelId', db.table('channels'))
//     .without({ left: ['id', 'channelId', 'userId', 'createdAt'] })
//     .zip()
//     .filter(channel => db.not(channel.hasFields('deletedAt')))
//     .run();
// };
const getChannelsByUser = async (userId: string): Promise<Array<DBChannel>> => {
  return (await db
    .collection('usersChannels')
    .find({})
    .toArray())
    .filter(usersChannel => {
      return (
        usersChannel.userId == userId &&
        (usersChannel.isMember ||
          usersChannel.isModerator ||
          usersChannel.isOwner)
      );
    })
    .map(async usersChannel => {
      return (await db
        .collection('channels')
        .find({})
        .toArray())
        .filter(channel => {
          return channel.id == usersChannel.channelId;
        })
        .map(channel => {
          return { left: usersChannel, right: channel };
        });
    })
    .reduce((previousValue, currentValue) => {
      return [...previousValue, ...currentValue];
    }, [])
    .map(element => {
      const left = element.left;

      delete left.id;
      delete left.channelId;
      delete left.userId;
      delete left.createdAt;

      return element;
    })
    .map(element => {
      return { ...element.left, ...element.right };
    })
    .filter(channel => {
      return !channel.deletedAt;
    });
};

// const getChannelBySlug = async (
//   channelSlug: string,
//   communitySlug: string
// ): Promise<?DBChannel> => {
//   const [communityId] = await db
//     .table('communities')
//     .getAll(communitySlug, { index: 'slug' })('id')
//     .run();

//   if (!communityId) return null;

//   return db
//     .table('channels')
//     .getAll(communityId, { index: 'communityId' })
//     .filter(channel =>
//       channel('slug')
//         .eq(channelSlug)
//         .and(db.not(channel.hasFields('deletedAt')))
//     )
//     .run()
//     .then(res => {
//       if (Array.isArray(res) && res.length > 0) return res[0];
//       return null;
//     });
// };
const getChannelBySlug = async (
  channelSlug: string,
  communitySlug: string
): Promise<?DBChannel> => {
  const [communityId] = (await db
    .collection('communities')
    .find({})
    .toArray()).filter(community => {
    return community.slug == communitySlug;
  });

  if (!communityId) {
    return null;
  }

  const res = (await db
    .collection('channels')
    .find({})
    .toArray())
    .filter(channel => {
      return channel.communityId == communityId;
    })
    .filter(channel => {
      return channel.slug == channelSlug && !channel.deletedAt;
    });

  if (Array.isArray(res) && res.length > 0) {
    return res[0];
  }

  return null;
};

// const getChannelById = async (id: string) => {
//   return (await channelsByIdsQuery(id).run())[0] || null;
// };
const getChannelById = async (id: string) => {
  return (await channelsByIdsQuery(id))[0] || null;
};

type GetChannelByIdArgs = {|
  id: string,
|};

type GetChannelBySlugArgs = {|
  slug: string,
  communitySlug: string,
|};

export type GetChannelArgs = GetChannelByIdArgs | GetChannelBySlugArgs;

// const getChannels = (channelIds: Array<string>): Promise<Array<DBChannel>> => {
//   return channelsByIdsQuery(...channelIds).run();
// };
const getChannels = async (
  channelIds: Array<string>
): Promise<Array<DBChannel>> => {
  return await channelsByIdsQuery(...channelIds);
};

type GroupedCount = {
  group: string,
  reduction: number,
};

// prettier-ignore
// const getChannelsThreadCounts = (channelIds: Array<string>): Promise<Array<GroupedCount>> => {
//   return threadsByChannelsQuery(...channelIds)
//     .group('channelId')
//     .count()
//     .run();
// };
const getChannelsThreadCounts = async (channelIds: Array<string>): Promise<Array<GroupedCount>> => {
  return Object.values((await threadsByChannelsQuery(...channelIds))
    .reduce((previousValue, currentValue) => {
      const group = previousValue[currentValue.channelId] || {
        group: currentValue.channelId,
        reduction: []
      };
      group.reduction.push(currentValue);
      previousValue[currentValue.channelId] = group;
      return previousValue;
    }, {}))
    .map(group => {
      group.reduction = group.reduction.length;
      return group;
    })
};

// prettier-ignore
// const getChannelsMemberCounts = (channelIds: Array<string>): Promise<Array<GroupedCount>> => {
//   return membersByChannelsQuery(...channelIds)
//     .group('channelId')
//     .count()
//     .run();
// };

const getChannelsMemberCounts = async (channelIds: Array<string>): Promise<Array<GroupedCount>> => {
  return Object.values((await membersByChannelsQuery(...channelIds))
    .reduce((previousValue, currentValue) => {
      const group = previousValue[currentValue.channelId] || {
        group: currentValue.channelId,
        reduction: []
      };
      group.reduction.push(currentValue);
      previousValue[currentValue.channelId] = group;
      return previousValue;
    }, {}))
    .map(group => {
      group.reduction = group.reduction.length;
      return group;
    })
};

export type CreateChannelInput = {
  input: {
    communityId: string,
    name: string,
    description: string,
    slug: string,
    isPrivate: boolean,
    isDefault: boolean,
  },
};

export type EditChannelInput = {
  input: {
    channelId: string,
    name: string,
    description: string,
    slug: string,
    isPrivate: Boolean,
  },
};

// prettier-ignore
// const createChannel = ({ input }: CreateChannelInput, userId: string): Promise<DBChannel> => {
//   const { communityId, name, slug, description, isPrivate, isDefault } = input;

//   return db
//     .table('channels')
//     .insert(
//       {
//         communityId,
//         createdAt: new Date(),
//         name,
//         description,
//         slug,
//         isPrivate,
//         isDefault: isDefault ? true : false,
//         memberCount: 0,
//       },
//       { returnChanges: true }
//     )
//     .run()
//     .then(result => result.changes[0].new_val)
//     .then(channel => {
//       // only trigger a new channel notification is the channel is public
//       if (!channel.isPrivate) {
//         sendChannelNotificationQueue.add({ channel, userId });
//       }

//       return channel;
//     });
// };
const createChannel = async ({ input }: CreateChannelInput, userId: string): Promise<DBChannel> => {
  const { communityId, name, slug, description, isPrivate, isDefault } = input;

  return db.collection("channels")
    .insertOne({
      communityId,
      createdAt: new Date(),
      name,
      description,
      slug,
      isPrivate,
      isDefault: isDefault ? true : false,
      memberCount: 0,
    })
    .then(channel => {
      // only trigger a new channel notification is the channel is public
      if (!channel.isPrivate) {
        sendChannelNotificationQueue.add({ channel, userId });
      }

      return channel;
    })
  


};

// prettier-ignore
const createGeneralChannel = (communityId: string, userId: string): Promise<DBChannel> => {
  return createChannel(
    {
      input: {
        name: 'General',
        slug: 'general',
        description: 'General Chatter',
        communityId,
        isPrivate: false,
        isDefault: true,
      },
    },
    userId
  );
};

// prettier-ignore
const editChannel = async ({ input }: EditChannelInput): Promise<DBChannel> => {
  const { name, slug, description, isPrivate, channelId } = input;

  const channelRecord = await db
    .table('channels')
    .get(channelId)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        description,
        slug,
        isPrivate,
      });
    });

  return db
    .table('channels')
    .get(channelId)
    .update({ ...channelRecord }, { returnChanges: 'always' })
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        return result.changes[0].new_val;
      }

      // an update was triggered from the client, but no data was changed
      if (result.unchanged === 1) {
        return result.changes[0].old_val;
      }

      return null;
    });
};

const deleteChannel = (channelId: string, userId: string): Promise<Boolean> => {
  return db
    .table('channels')
    .get(channelId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date(),
        slug: db.uuid(),
      },
      {
        returnChanges: true,
        nonAtomic: true,
      }
    )
    .run();
};

// prettier-ignore
const archiveChannel = (channelId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update({ archivedAt: new Date() }, { returnChanges: 'always' })
    .run()
    .then(result => {
      return result.changes[0].new_val || result.changes[0].old_val;
    });
};

// prettier-ignore
const restoreChannel = (channelId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update({ archivedAt: db.literal() }, { returnChanges: 'always' })
    .run()
    .then(result => {
      return result.changes[0].new_val || result.changes[0].old_val;
    });
};

// prettier-ignore
const archiveAllPrivateChannels = async (communityId: string) => {
  const channels = await db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isPrivate: true })
    .run();

  if (!channels || channels.length === 0) return;

  return await db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isPrivate: true })
    .update({ archivedAt: new Date() })
    .run();
};

const incrementMemberCount = (channelId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update(
      {
        memberCount: db
          .row('memberCount')
          .default(0)
          .add(1),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val);
};

const decrementMemberCount = (channelId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update(
      {
        memberCount: db
          .row('memberCount')
          .default(1)
          .sub(1),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val);
};

const setMemberCount = (
  channelId: string,
  value: number
): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update(
      {
        memberCount: value,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val);
};

const getChannelsOnlineMemberCounts = (channelIds: Array<string>) => {
  return db
    .table('usersChannels')
    .getAll(...channelIds, {
      index: 'channelId',
    })
    .filter({ isBlocked: false, isMember: true })
    .pluck(['channelId', 'userId'])
    .eqJoin('userId', db.table('users'))
    .pluck('left', { right: ['lastSeen', 'isOnline'] })
    .zip()
    .filter(rec =>
      rec('isOnline')
        .eq(true)
        .or(
          rec('lastSeen')
            .toEpochTime()
            .ge(
              db
                .now()
                .toEpochTime()
                .sub(86400)
            )
        )
    )
    .group('channelId')
    .count()
    .run();
};

module.exports = {
  getChannelBySlug,
  getChannelById,
  getChannelsByUser,
  getChannelsByCommunity,
  getPublicChannelsByCommunity,
  getChannelsByUserAndCommunity,
  createChannel,
  createGeneralChannel,
  editChannel,
  deleteChannel,
  getChannelsMemberCounts,
  getChannelsThreadCounts,
  getChannels,
  archiveChannel,
  restoreChannel,
  archiveAllPrivateChannels,
  incrementMemberCount,
  decrementMemberCount,
  setMemberCount,
  getChannelsOnlineMemberCounts,
  __forQueryTests: {
    channelsByCommunitiesQuery,
    channelsByIdsQuery,
    threadsByChannelsQuery,
    membersByChannelsQuery,
  },
};
