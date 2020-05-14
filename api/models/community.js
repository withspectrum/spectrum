// @flow
const { db } = require('shared/db');
import intersection from 'lodash.intersection';
import { parseRange } from './utils';
import { uploadImage } from '../utils/file-storage';
import getRandomDefaultPhoto from '../utils/get-random-default-photo';
import {
  sendNewCommunityWelcomeEmailQueue,
  _adminSendCommunityCreatedEmailQueue,
  searchQueue,
} from 'shared/bull/queues';
import { createChangefeed } from 'shared/changefeed-utils';
import type { DBCommunity, DBUser } from 'shared/types';
import type { Timeframe } from './utils';

export const getCommunityById = (id: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(id)
    .run()
    .then(result => {
      if (result && result.deletedAt) return null;
      return result;
    });
};

// prettier-ignore
export const getCommunities = (communityIds: Array<string>): Promise<Array<DBCommunity>> => {
  return db
    .table('communities')
    .getAll(...communityIds)
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run();
};

// prettier-ignore
export const getCommunitiesBySlug = (slugs: Array<string>): Promise<Array<DBCommunity>> => {
  return db
    .table('communities')
    .getAll(...slugs, { index: 'slug' })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run();
};

export const getCommunityBySlug = (slug: string): Promise<?DBCommunity> => {
  return db
    .table('communities')
    .getAll(slug, { index: 'slug' })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()
    .then(results => {
      if (!results || results.length === 0) return null;
      return results[0];
    });
};

// prettier-ignore
export const getCommunitiesByUser = (userId: string): Promise<Array<DBCommunity>> => {
  return (
    db
      .table('usersCommunities')
      // get all the user's communities
      .getAll([userId, true], { index: 'userIdAndIsMember' })
      // get the community objects for each community
      .eqJoin('communityId', db.table('communities'))
      // get rid of unnecessary info from the usersCommunities object on the left
      .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
      // zip the tables
      .zip()
      // ensure we don't return any deleted communities
      .filter(community => db.not(community.hasFields('deletedAt')))
      .run()
  );
};

// prettier-ignore
export const getVisibleCommunitiesByUser = async (evaluatingUserId: string, currentUserId: string) => {
  const evaluatingUserMemberships = await db
    .table('usersCommunities')
    // get all the user's communities
    .getAll([evaluatingUserId, true], { index: 'userIdAndIsMember' })
    // get the community objects for each community
    .eqJoin('communityId', db.table('communities'))
    // get rid of unnecessary info from the usersCommunities object on the left
    .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
    // zip the tables
    .zip()
    // ensure we don't return any deleted communities
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()

  const currentUserMemberships = await db
    .table('usersCommunities')
    // get all the user's communities
    .getAll([currentUserId, true], { index: 'userIdAndIsMember' })
    // get the community objects for each community
    .eqJoin('communityId', db.table('communities'))
    // get rid of unnecessary info from the usersCommunities object on the left
    .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
    // zip the tables
    .zip()
    // ensure we don't return any deleted communities
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()

  const evaluatingUserCommunityIds = evaluatingUserMemberships.map(community => community.id)
  const currentUserCommunityIds = currentUserMemberships.map(community => community.id)
  const publicCommunityIds = evaluatingUserMemberships
    .filter(community => !community.isPrivate)
    .map(community => community.id)

  const overlappingMemberships = intersection(evaluatingUserCommunityIds, currentUserCommunityIds)
  const allVisibleCommunityIds = [...publicCommunityIds, ...overlappingMemberships]
  const distinctCommunityIds = allVisibleCommunityIds.filter((x, i, a) => a.indexOf(x) === i)

  return await db
    .table('communities')
    .getAll(...distinctCommunityIds)
    .run()
}

export const getPublicCommunitiesByUser = async (userId: string) => {
  return await db
    .table('usersCommunities')
    // get all the user's communities
    .getAll([userId, true], { index: 'userIdAndIsMember' })
    // get the community objects for each community
    .eqJoin('communityId', db.table('communities'))
    // only return public community ids
    .filter(row => row('right')('isPrivate').eq(false))
    // get rid of unnecessary info from the usersCommunities object on the left
    .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
    // zip the tables
    .zip()
    // ensure we don't return any deleted communities
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run();
};

export const getCommunitiesChannelCounts = (communityIds: Array<string>) => {
  return db
    .table('channels')
    .getAll(...communityIds, { index: 'communityId' })
    .filter(channel => db.not(channel.hasFields('deletedAt')))
    .group('communityId')
    .count()
    .run();
};

export const getCommunitiesMemberCounts = (communityIds: Array<string>) => {
  return db
    .table('usersCommunities')
    .getAll(...communityIds.map(id => [id, true]), {
      index: 'communityIdAndIsMember',
    })
    .group('communityId')
    .count()
    .run();
};

export const getCommunitiesOnlineMemberCounts = (
  communityIds: Array<string>
) => {
  return db
    .table('usersCommunities')
    .getAll(...communityIds.map(id => [id, true]), {
      index: 'communityIdAndIsMember',
    })
    .pluck(['communityId', 'userId'])
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
    .group('communityId')
    .count()
    .run();
};

export const setCommunityLastActive = (id: string, lastActive: Date) => {
  return db
    .table('communities')
    .get(id)
    .update({
      lastActive: new Date(lastActive),
    })
    .run();
};

export type CreateCommunityInput = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
    coverFile: Object,
    isPrivate: boolean,
  },
};

export type EditCommunityInput = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
    coverFile: Object,
    coverPhoto: string,
    communityId: string,
    watercoolerId?: boolean,
  },
};

// prettier-ignore
export const createCommunity = ({ input }: CreateCommunityInput, user: DBUser): Promise<DBCommunity> => {
  const { name, slug, description, website, file, coverFile, isPrivate } = input

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
        modifiedAt: null,
        creatorId: user.id,
        administratorEmail: user.email,
        isPrivate,
        memberCount: 0,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(community => {
      searchQueue.add({
        id: community.id,
        type: 'community',
        event: 'created'
      })

      // send a welcome email to the community creator
      sendNewCommunityWelcomeEmailQueue.add({ user, community });
      // email brian with info about the community and owner
      _adminSendCommunityCreatedEmailQueue.add({ user, community });

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
            return null;
          });
      }

      if (file || coverFile) {
        if (file && !coverFile) {
          const { coverPhoto } = getRandomDefaultPhoto();
          return uploadImage(file, 'communities', community.id)
            .then(profilePhoto => {
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
            })
            .catch(err => {
              console.error(err);
            });
        } else if (!file && coverFile) {
          const { profilePhoto } = getRandomDefaultPhoto();
          return uploadImage(coverFile, 'communities', community.id)
            .then(coverPhoto => {
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

                    return null;
                  })
              );
            })
            .catch(err => {
              console.error(err);
            });
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'communities', community.id).catch(err => {
              console.error(err);
            });
          };

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'communities', community.id).catch(
              err => {
                console.error(err);
              }
            );
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

                  return null;
                })
            );
          });
        }
      }
    });
};

// prettier-ignore
export const editCommunity = async ({ input }: EditCommunityInput, userId: string): Promise<DBCommunity> => {
  const { name, slug, description, website, watercoolerId, file, coverPhoto, coverFile, communityId } = input

  let community = await db.table('communities').get(communityId).run()

  // if the input comes in with a coverPhoto of length 0 (empty string), it means
  // the user was trying to delete or reset their cover photo from the front end.
  // in this case we can just set a new default. Otherwise, just keep their
  // original cover photo
  let updatedCoverPhoto = community.coverPhoto
  if (input.coverPhoto.length === 0) {
    ({ coverPhoto: updatedCoverPhoto } = getRandomDefaultPhoto())
  }

  return db
    .table('communities')
    .get(communityId)
    .update({
      ...community,
      name,
      slug,
      description,
      website,
      watercoolerId: watercoolerId || community.watercoolerId,
      coverPhoto: coverFile 
        ? await uploadImage(coverFile, 'communities', community.id) 
        : updatedCoverPhoto,
      profilePhoto: file 
        ? await uploadImage(file, 'communities', community.id) 
        : community.profilePhoto,
      modifiedAt: new Date()
    }, { returnChanges: 'always' })
    .run()
    .then(result => {
      if (result.replaced === 1) {
        community = result.changes[0].new_val;
      }

      // an update was triggered from the client, but no data was changed
      if (result.unchanged === 1) {
        community = result.changes[0].old_val;
      }

      searchQueue.add({
        id: communityId,
        type: 'community',
        event: 'edited'
      })

      return community
    })
};

export const toggleCommunityRedirect = async (communityId: string) => {
  const community = await db.table('communities').get(communityId);
  if (!community) return null;

  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        redirect: !community.redirect,
      },
      {
        returnChanges: true,
      }
    )
    .then(result => {
      if (!Array.isArray(result.changes) || result.changes.length === 0)
        return getCommunityById(communityId);
      return result.changes[0].new_val;
    });
};

export const toggleCommunityNoindex = async (communityId: string) => {
  const community = await db.table('communities').get(communityId);
  if (!community) return null;

  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        noindex: !community.noindex,
      },
      {
        returnChanges: true,
      }
    )
    .then(result => {
      if (!Array.isArray(result.changes) || result.changes.length === 0)
        return getCommunityById(communityId);
      return result.changes[0].new_val;
    });
};

export const setCommunityWatercoolerId = (
  communityId: string,
  threadId: ?string
) => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        watercoolerId: threadId,
      },
      {
        returnChanges: true,
      }
    )
    .run()
    .then(result => {
      if (!Array.isArray(result.changes) || result.changes.length === 0)
        return getCommunityById(communityId);
      return result.changes[0].new_val;
    });
};

// prettier-ignore
export const deleteCommunity = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date(),
        slug: db.uuid(),
      },
      {
        returnChanges: 'always',
        nonAtomic: true,
      }
    )
    .run()
    .then(() => {
      searchQueue.add({
        id: communityId,
        type: 'community',
        event: 'deleted'
      })
    });
};

// prettier-ignore
export const setPinnedThreadInCommunity = (communityId: string, value: ?string, userId: string): Promise<DBCommunity> => {
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
    .then(result => {
      // prettier-ignore
      return result.changes[0].new_val
    });
};

// prettier-ignore
export const userIsMemberOfAnyChannelInCommunity = (communityId: string, userId: string): Promise<Boolean> => {
  return db('spectrum')
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .eqJoin('id', db.table('usersChannels'), { index: 'channelId' })
    .zip()
    .filter({ userId })
    .pluck('isMember')
    .run()
    .then(channels => channels.some(channel => channel.isMember));
};

export const getRecentCommunities = (): Array<DBCommunity> => {
  return db
    .table('communities')
    .orderBy({ index: db.desc('createdAt') })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .limit(100)
    .run();
};

export const getThreadCount = (communityId: string) => {
  return db
    .table('threads')
    .getAll(communityId, { index: 'communityId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .count()
    .run();
};

export const getCommunityGrowth = async (
  table: string,
  range: Timeframe,
  field: string,
  communityId: string,
  filter?: mixed
) => {
  const { current, previous } = parseRange(range);
  const currentPeriodCount = await db
    .table(table)
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row(field).during(db.now().sub(current), db.now()))
    .filter(filter ? filter : '')
    .count()
    .run();

  const prevPeriodCount = await db
    .table(table)
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row(field).during(db.now().sub(previous), db.now().sub(current)))
    .filter(filter ? filter : '')
    .count()
    .run();

  const rate = (await (currentPeriodCount - prevPeriodCount)) / prevPeriodCount;
  return {
    currentPeriodCount,
    prevPeriodCount,
    growth: Math.round(rate * 100),
  };
};

// prettier-ignore
export const setCommunityPendingAdministratorEmail = (communityId: string, email: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      pendingAdministratorEmail: email,
    })
    .run()
    .then(async () => {
      return await getCommunityById(communityId)
    });
};

// prettier-ignore
export const updateCommunityAdministratorEmail = (communityId: string, email: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      administratorEmail: email,
      pendingAdministratorEmail: db.literal(),
    })
    .run()
    .then(async () => {
      return await getCommunityById(communityId)
    });
};

export const resetCommunityAdministratorEmail = (communityId: string) => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      administratorEmail: null,
      pendingAdministratorEmail: db.literal(),
    })
    .run();
};

export const incrementMemberCount = (
  communityId: string
): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
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

export const decrementMemberCount = (
  communityId: string
): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
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

export const setMemberCount = (
  communityId: string,
  value: number
): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        memberCount: value,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val);
};

const getUpdatedCommunitiesChangefeed = () =>
  db
    .table('communities')
    .changes({
      includeInitial: false,
    })('new_val')
    .run();

export const listenToUpdatedCommunities = (cb: Function): Function => {
  return createChangefeed(
    getUpdatedCommunitiesChangefeed,
    cb,
    'listenToUpdatedCommunities'
  );
};
