// @flow
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';
import { createChannel, deleteChannel, leaveChannel } from './channel';
import { uploadCommunityPhoto, generateImageUrl } from '../utils/s3';

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
    .filter(community => db.not(community.hasFields('isDeleted')))
    .run();
};

const getCommunitiesBySlug = (slugs: Array<string>): Promise<Array<Object>> => {
  return db
    .table('communities')
    .filter(community => db.expr(slugs).contains(community('slug')))
    .filter(community => db.not(community.hasFields('isDeleted')))
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
      .filter(community => db.not(community.hasFields('isDeleted')))
      // sort by community creation date
      .orderBy('createdAt')
      .run()
  );
};

const getCommunityMetaData = (communityId: string): Promise<Array<number>> => {
  const getChannelCount = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .run()
    .then(data => data.length);

  const getMemberCount = db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isBlocked: false })
    .run()
    .then(data => data.length);

  return Promise.all([getChannelCount, getMemberCount]);
};

const getCommunityPermissions = (
  communityId: string,
  userId: string
): Promise<Array<Object>> => {
  return db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .filter({ communityId })
    .run();
};

export type CreateCommunityArguments = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
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
    input: { name, slug, description, website, file },
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
        members: [creatorId],
        owners: [creatorId],
        moderators: [],
        blockedUsers: [],
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(community => {
      // if no file was uploaded, skip this step
      if (!file) return Promise.all([community]);

      // if a file was uploaded, upload it to s3
      if (file) {
        return Promise.all([
          community,
          uploadCommunityPhoto(file, community, data => {
            // returns the imgix path for the final image
            const profilePhoto = generateImageUrl(data.path);
            // update the community with the profilePhoto
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    profilePhoto,
                  },
                  { returnChanges: true }
                )
                .run()
                // return the resulting community with the profilePhoto set
                .then(
                  result =>
                    (result.changes.length > 0
                      ? result.changes[0].new_val
                      : db.table('communities').get(community.id).run())
                )
            );
          }),
        ]);
      }
    })
    .then(([community]) => {
      // create a default 'general' channel in the newly created community
      return Promise.all([
        community,
        createChannel(
          {
            input: {
              name: 'General',
              slug: 'general',
              description: 'General Chatter',
              communityId: community.id,
              isPrivate: false,
            },
          },
          creatorId // community owner owns the channel by default
        ),
      ]);
    })
    .then(data => data[0]); // return community object
};

const editCommunity = ({
  input: { name, slug, description, website, file, communityId },
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
      if (!file) {
        return Promise.all([
          db
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
            }),
        ]);
      }

      if (file) {
        return Promise.all([
          uploadCommunityPhoto(file, community, data => {
            // returns the imgix path for the final image
            const profilePhoto = generateImageUrl(data.path);
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
          }),
        ]);
      }
    })
    .then(data => data[0]);
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
        isDeleted: true,
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

const leaveCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      row => ({
        members: row('members').filter(item => item.ne(userId)),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        (changes.length > 0
          ? changes[0].new_val
          : db.table('communities').get(communityId).run())
    );
};

const joinCommunity = (
  communityId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      row => ({
        members: row('members').append(userId),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        (changes.length > 0
          ? changes[0].new_val
          : db.table('communities').get(communityId).run())
    );
};

// TODO: Handle default channels as set by the community owner. For now
// we treat the 'general' channel as default.
const subscribeToDefaultChannels = (
  communityId: string,
  userId: string
): Promise<Array<Object>> => {
  return db
    .table('channels')
    .filter({ communityId: communityId, slug: 'general' })
    .update(
      row => ({
        members: row('members').append(userId),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        (changes.length > 0
          ? changes[0].new_val
          : db
              .table('channels')
              .filter({ communityId: communityId, slug: 'general' })
              .run())
    );
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
  return db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .run()
    .then(channels => {
      return channels.some(channel => channel.members.indexOf(userId) > -1);
    });
};

module.exports = {
  getCommunities,
  getCommunitiesBySlug,
  getCommunityMetaData,
  getCommunityPermissions,
  getCommunitiesByUser,
  createCommunity,
  editCommunity,
  deleteCommunity,
  leaveCommunity,
  joinCommunity,
  subscribeToDefaultChannels,
  unsubscribeFromAllChannelsInCommunity,
  userIsMemberOfCommunity,
  userIsMemberOfAnyChannelInCommunity,
};
