// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';
import { createChannel, deleteChannel } from './channel';
import { uploadImage } from '../utils/s3';
import getRandomDefaultPhoto from '../utils/get-random-default-photo';

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
      // get the community objects for each community
      .eqJoin('communityId', db.table('communities'))
      // get rid of unnecessary info from the usersCommunities object on the left
      .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
      // zip the tables
      .zip()
      // ensure we don't return any deleted communities
      .filter(community => db.not(community.hasFields('deletedAt')))
      .filter(row => row('isMember').eq(true).or(row('isOwner').eq(true)))
      // sort by community creation date
      .orderBy('createdAt')
      .run()
  );
};

const getCommunityMetaData = (communityId: string): Promise<Array<number>> => {
  const getChannelCount = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .count()
    .run();

  const getMemberCount = db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isBlocked: false })
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
  creatorId: string
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
            community.id,
            profilePhoto => {
              // update the community with the profilePhoto
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
            }
          );
        } else if (!file && coverFile) {
          const { profilePhoto } = getRandomDefaultPhoto();
          return uploadImage(
            coverFile,
            'communities',
            community.id,
            coverPhoto => {
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
            }
          );
        } else if (file && coverFile) {
          const uploadFile = file => {
            return new Promise(resolve => {
              uploadImage(file, 'communities', community.id, profilePhoto => {
                resolve(profilePhoto);
              });
            });
          };

          const uploadCoverFile = coverFile => {
            return new Promise(resolve => {
              uploadImage(
                coverFile,
                'communities',
                community.id,
                coverPhoto => {
                  resolve(coverPhoto);
                }
              );
            });
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
            community.id,
            profilePhoto => {
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
            }
          );
        } else if (!file && coverFile) {
          return uploadImage(
            coverFile,
            'communities',
            community.id,
            coverPhoto => {
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
            }
          );
        } else if (file && coverFile) {
          const uploadFile = file => {
            return new Promise(resolve => {
              uploadImage(file, 'communities', community.id, profilePhoto => {
                resolve(profilePhoto);
              });
            });
          };

          const uploadCoverFile = coverFile => {
            return new Promise(resolve => {
              uploadImage(
                coverFile,
                'communities',
                community.id,
                coverPhoto => {
                  resolve(coverPhoto);
                }
              );
            });
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
    .run()
    .then(result => {
      // community was successfully deleted, now delete all channels
      if (result.replaced >= 1) {
        const communityId = result.changes[0].old_val.id;
        return db
          .table('channels')
          .getAll(communityId, { index: 'communityId' })
          .run()
          .then(channels => channels.map(channel => deleteChannel(channel.id)))
          .then(() => result);
      }

      // update failed
      return new UserError(
        "Something went wrong and we weren't able to delete this community"
      );
    });
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
      // if the user is not a member of any other channels in the community
      if (channels.length > 0) return false;
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
        .map(community => community.id);

      return db
        .table('communities')
        .getAll(...sortedCommunities)
        .filter(community => db.not(community.hasFields('deletedAt')))
        .limit(10)
        .run();
    });
};

module.exports = {
  getCommunities,
  getCommunitiesBySlug,
  getCommunityMetaData,
  getCommunitiesByUser,
  createCommunity,
  editCommunity,
  deleteCommunity,
  unsubscribeFromAllChannelsInCommunity,
  userIsMemberOfCommunity,
  userIsMemberOfAnyChannelInCommunity,
  getTopCommunities,
};
