// @flow
/**
 * Storing and retrieving communities
 */
const { db } = require('./db');
// $FlowFixMe
import { UserError } from 'graphql-errors';
import { createFrequency, unsubscribeFrequency } from './frequency';
import { uploadCommunityPhoto, generateImageUrl } from '../utils/s3';

type GetCommunityByIdArgs = {
  id: string,
};

type GetCommunityBySlugArgs = {
  slug: string,
};

export type GetCommunityArgs = GetCommunityByIdArgs | GetCommunityBySlugArgs;

const getCommunities = (ids: Array<string>) => {
  return db.table('communities').getAll(...ids).run();
};

const getCommunitiesBySlug = (slugs: Array<string>) => {
  return db
    .table('communities')
    .filter(community => db.expr(slugs).contains(community('slug')))
    .run();
};

const getCommunitiesByUser = (uid: string) => {
  return db
    .table('communities')
    .filter(community => community('members').contains(uid))
    .run();
};

const getCommunityMetaData = (id: String) => {
  const getFrequencyCount = db
    .table('frequencies')
    .filter({ community: id })
    .count()
    .run();
  const getMemberCount = db
    .table('communities')
    .get(id)
    .getField('members')
    .count()
    .run();

  return Promise.all([getFrequencyCount, getMemberCount]);
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
    id: string,
  },
};

const createCommunity = (
  {
    input: { name, slug, description, website, file },
  }: CreateCommunityArguments,
  creatorId: string
) => {
  return db
    .table('communities')
    .insert(
      {
        createdAt: new Date(),
        slug,
        name,
        description,
        website,
        members: [creatorId],
        owners: [creatorId],
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
            const photoURL = generateImageUrl(data.path);
            // update the community with the photoURL
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    photoURL,
                  },
                  { returnChanges: true }
                )
                .run()
                // return the resulting community with the photoURL set
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
      // create a default 'general' frequency in the newly created community
      return Promise.all([
        community,
        createFrequency(
          {
            input: {
              name: 'General',
              slug: 'general',
              description: 'General Chatter',
              community: community.id,
            },
          },
          creatorId // community owner owns the frequency by default
        ),
      ]);
    })
    .then(data => data[0]); // return community object
};

const editCommunity = ({
  input: { name, slug, description, website, file, id },
}: EditCommunityArguments) => {
  return db
    .table('communities')
    .get(id)
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
            .get(id)
            .update({ ...community }, { returnChanges: true })
            .run()
            .then(result => result.changes[0].new_val),
        ]);
      }

      if (file) {
        return Promise.all([
          uploadCommunityPhoto(file, community, data => {
            // returns the imgix path for the final image
            const photoURL = generateImageUrl(data.path);
            // update the community with the photoURL
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    photoURL,
                  },
                  { returnChanges: true }
                )
                .run()
                // return the resulting community with the photoURL set
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
    .then(data => data[0]);
};

const deleteCommunity = id => {
  return db
    .table('communities')
    .get(id)
    .delete({ returnChanges: true })
    .run()
    .then(({ deleted, changes }) => {
      if (deleted > 0) {
        // community was successfully deleted, now delete all frequencies
        // TODO: Return community object and frequencies objects to remove
        // them from the client store
        const community = changes[0].old_val.id;
        return db.table('frequencies').filter({ community }).delete().run();
      }
    });
};

const leaveCommunity = (id, uid) => {
  return db
    .table('communities')
    .get(id)
    .update(
      row => ({
        members: row('members').filter(item => item.ne(uid)),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        (changes.length > 0
          ? changes[0].new_val
          : db.table('communities').get(id).run())
    );
};

const joinCommunity = (id, uid) => {
  return db
    .table('communities')
    .get(id)
    .update(
      row => ({
        members: row('members').append(uid),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        (changes.length > 0
          ? changes[0].new_val
          : db.table('communities').get(id).run())
    );
};

const getAllCommunityStories = (id: string): Promise<Array<any>> => {
  return (
    db
      .table('stories')
      .orderBy(db.desc('modifiedAt'))
      // Add the frequency object to each story
      .eqJoin('frequency', db.table('frequencies'))
      // Only take the community of a frequency
      .pluck({ left: true, right: { community: true } })
      .zip()
      // Filter by the community
      .filter({ community: id })
      // Don't send the community back
      .without('community')
      .run()
  );
};

const subscribeToDefaultFrequencies = (id: string, uid: string) => {
  // TODO: Handle default frequencies as set by the community owner. For now
  // we treat the 'general' frequency as default
  return db
    .table('frequencies')
    .filter({ community: id, slug: 'general' })
    .update(
      row => ({
        subscribers: row('subscribers').append(uid),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        (changes.length > 0
          ? changes[0].new_val
          : db
              .table('frequencies')
              .filter({ community: id, slug: 'general' })
              .run())
    );
};

const unsubscribeFromAllFrequenciesInCommunity = (id: string, uid: string) => {
  return db
    .table('frequencies')
    .filter({ community: id })
    .run()
    .then(frequencies => {
      return frequencies.map(frequency =>
        unsubscribeFrequency(frequency.id, uid)
      );
    });
};

const userIsMemberOfCommunity = (id: string, uid: string) => {
  return db.table('communities').get(id).run().then(community => {
    return community.members.indexOf(uid) > -1;
  });
};

const userIsMemberOfAnyFrequencyInCommunity = (id: string, uid: string) => {
  return db
    .table('frequencies')
    .filter({ community: id })
    .run()
    .then(frequencies => {
      return frequencies.some(
        frequency => frequency.subscribers.indexOf(uid) > -1
      );
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
  leaveCommunity,
  joinCommunity,
  subscribeToDefaultFrequencies,
  unsubscribeFromAllFrequenciesInCommunity,
  getAllCommunityStories,
  userIsMemberOfCommunity,
  userIsMemberOfAnyFrequencyInCommunity,
};
