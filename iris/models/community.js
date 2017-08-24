// @flow
const { db } = require('./db');
// $FlowFixMe
import UserError from '../utils/UserError';
import { createChannel, deleteChannel } from './channel';
import { uploadImage } from '../utils/s3';
import getRandomDefaultPhoto from '../utils/get-random-default-photo';
import { addQueue } from '../utils/workerQueue';

type GetCommunityByIdArgs = {
  id: string,
};

type GetCommunityBySlugArgs = {
  slug: string,
};

export type GetCommunityArgs = GetCommunityByIdArgs | GetCommunityBySlugArgs;

const getCommunities = (
  communityIds: Array<string>
): Promise<Array<Object>> => {
  return db
    .table('communities')
    .getAll(...communityIds)
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run();
};

const getCommunitiesBySlug = (slugs: Array<string>): Promise<Array<Object>> => {
  return db
    .table('communities')
    .filter(community => db.expr(slugs).contains(community('slug')))
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run();
};

const getCommunitiesByUser = (userId: string): Promise<Array<Object>> => {
  return (
    db
      .table('usersCommunities')
      // get all the user's communities
      .getAll(userId, { index: 'userId' })
      // only return communities the user is a member of
      .filter({ isMember: true })
      // get the community objects for each community
      .eqJoin('communityId', db.table('communities'))
      // get rid of unnecessary info from the usersCommunities object on the left
      .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
      // zip the tables
      .zip()
      // ensure we don't return any deleted communities
      .filter(community => db.not(community.hasFields('deletedAt')))
      .filter(row => row('isMember').eq(true).or(row('isOwner').eq(true)))
      .run()
  );
};

const getCommunityMetaData = (communityId: string): Promise<Array<number>> => {
  const getChannelCount = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter(channel => db.not(channel.hasFields('deletedAt')))
    .count()
    .run();

  const getMemberCount = db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isBlocked: false, isMember: true })
    .count()
    .run();

  return Promise.all([getChannelCount, getMemberCount]);
};

export type CreateCommunityArguments = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
    coverFile: Object,
  },
};

export type EditCommunityArguments = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
    communityId: string,
  },
};

const createCommunity = (
  {
    input: { name, slug, description, website, file, coverFile },
  }: CreateCommunityArguments,
  user
): Promise<Object> => {
  return db
    .table('communities')
    .insert(
      {
        createdAt: new Date(),
        name,
        description,
        website,
        profilePhoto: null,
        coverPhoto: null,
        slug,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(community => {
      // send a welcome email to the community creator
      addQueue('send new community welcome email', { user, community });

      // if no file was uploaded, update the community with new string values
      if (!file && !coverFile) {
        const { coverPhoto, profilePhoto } = getRandomDefaultPhoto();
        return db
          .table('communities')
          .get(community.id)
          .update(
            { ...community, profilePhoto, coverPhoto },
            { returnChanges: 'always' }
          )
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
          });
      }

      if (file || coverFile) {
        if (file && !coverFile) {
          const { coverPhoto } = getRandomDefaultPhoto();
          return uploadImage(
            file,
            'communities',
            community.id
          ).then(profilePhoto => {
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    profilePhoto,
                    coverPhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        } else if (!file && coverFile) {
          const { profilePhoto } = getRandomDefaultPhoto();
          return uploadImage(
            coverFile,
            'communities',
            community.id
          ).then(coverPhoto => {
            // update the community with the profilePhoto
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                    profilePhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'communities', community.id);
          };

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'communities', community.id);
          };

          return Promise.all([
            uploadFile(file),
            uploadCoverFile(coverFile),
          ]).then(([profilePhoto, coverPhoto]) => {
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                    profilePhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        }
      }
    });
};

const editCommunity = ({
  input: { name, slug, description, website, file, coverFile, communityId },
}: EditCommunityArguments): Promise<Object> => {
  return db
    .table('communities')
    .get(communityId)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        slug,
        description,
        website,
      });
    })
    .then(community => {
      // if no file was uploaded, update the community with new string values
      if (!file && !coverFile) {
        return db
          .table('communities')
          .get(communityId)
          .update({ ...community }, { returnChanges: 'always' })
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
          });
      }

      if (file || coverFile) {
        if (file && !coverFile) {
          return uploadImage(
            file,
            'communities',
            community.id
          ).then(profilePhoto => {
            // update the community with the profilePhoto
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    profilePhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        } else if (!file && coverFile) {
          return uploadImage(
            coverFile,
            'communities',
            community.id
          ).then(coverPhoto => {
            // update the community with the profilePhoto
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'communities', community.id);
          };

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'communities', community.id);
          };

          return Promise.all([
            uploadFile(file),
            uploadCoverFile(coverFile),
          ]).then(([profilePhoto, coverPhoto]) => {
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                    profilePhoto,
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(result => {
                  // if an update happened
                  if (result.replaced === 1) {
                    return result.changes[0].new_val;
                  }

                  // an update was triggered from the client, but no data was changed
                  if (result.unchanged === 1) {
                    return result.changes[0].old_val;
                  }
                })
            );
          });
        }
      }
    });
};

/*
  We delete data non-destructively, meaning the record does not get cleared
  from the db. Instead, we set a 'deleted' field on the object with a value
  of the current time on the db.

  We set the value as a timestamp so that in the future we have option value
  to perform actions like:
  - permanantely delete records that were deleted > X days ago
  - run logs for deletions over time
  - etc
*/
const deleteCommunity = (communityId: string): Promise<Object> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        deletedAt: new Date(),
        slug: db.uuid(),
      },
      {
        returnChanges: 'always',
        nonAtomic: true,
      }
    )
    .run();
};

const setPinnedThreadInCommunity = (
  communityId: string,
  value: string
): Promise<Object> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        pinnedThreadId: value,
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const unsubscribeFromAllChannelsInCommunity = (
  communityId: string,
  userId: string
): Promise<Array<Object>> => {
  return db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .run()
    .then(channels => {
      return channels.map(channel => leaveChannel(channel.id, userId));
    });
};

const userIsMemberOfCommunity = (
  communityId: string,
  userId: string
): Promise<Boolean> => {
  return db.table('communities').get(communityId).run().then(community => {
    return community.members.indexOf(userId) > -1;
  });
};

const userIsMemberOfAnyChannelInCommunity = (
  communityId: string,
  userId: string
): Promise<Boolean> => {
  return db('spectrum')
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .eqJoin('id', db.table('usersChannels'), { index: 'channelId' })
    .zip()
    .filter({ userId })
    .pluck('isMember')
    .run()
    .then(channels => {
      // if any of the channels return true for isMember, we return true
      return channels.some(channel => channel.isMember);
    });
};

const getTopCommunities = (amount: number): Array<Object> => {
  return db
    .table('communities')
    .pluck('id')
    .run()
    .then(communities => communities.map(community => community.id))
    .then(communityIds => {
      return Promise.all(
        communityIds.map(community => {
          return db
            .table('usersCommunities')
            .getAll(community, { index: 'communityId' })
            .filter({ isMember: true })
            .count()
            .run()
            .then(count => {
              return {
                id: community,
                count,
              };
            });
        })
      );
    })
    .then(data => {
      let sortedCommunities = data
        .sort((x, y) => {
          return y.count - x.count;
        })
        .map(community => community.id)
        .slice(0, amount);

      return db
        .table('communities')
        .getAll(...sortedCommunities)
        .filter(community => db.not(community.hasFields('deletedAt')))
        .run();
    });
};

const getRecentCommunities = (amount: number): Array<Object> => {
  return db
    .table('communities')
    .orderBy({ index: db.desc('createdAt') })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .limit(10)
    .run();
};

const getCommunitiesBySearchString = (
  string: string
): Promise<Array<Object>> => {
  return db
    .table('communities')
    .filter(community => community.coerceTo('string').match(`(?i)${string}`))
    .filter(community => db.not(community.hasFields('deletedAt')))
    .limit(15)
    .run();
};

const searchThreadsInCommunity = (
  channels: Array<string>,
  searchString: string
): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(...channels, { index: 'channelId' })
    .filter(thread => thread.coerceTo('string').match(`(?i)${searchString}`))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .orderBy(db.desc('lastActive'))
    .run();
};

module.exports = {
  getCommunities,
  getCommunitiesBySlug,
  getCommunityMetaData,
  getCommunitiesByUser,
  createCommunity,
  editCommunity,
  deleteCommunity,
  setPinnedThreadInCommunity,
  unsubscribeFromAllChannelsInCommunity,
  userIsMemberOfCommunity,
  userIsMemberOfAnyChannelInCommunity,
  getTopCommunities,
  getRecentCommunities,
  getCommunitiesBySearchString,
  searchThreadsInCommunity,
};
