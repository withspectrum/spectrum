// @flow
/**
 * Storing and retrieving communities
 */
const { db } = require('./db');
import { UserError } from 'graphql-errors';
import { createFrequency } from './frequency';

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
  },
};

export type CreateCommunityArguments = {
  input: {
    name: string,
    slug: string,
    description: string,
    id: string,
  },
};

const createCommunity = (
  { input: { name, slug, description } }: CreateCommunityArguments,
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
        members: [creatorId],
        owners: [creatorId],
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(community =>
      Promise.all([
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
          creatorId
        ),
      ])
    )
    .then(([community]) => community);
};

const editCommunity = (
  { input: { name, slug, description, id } }: EditCommunityArguments,
  creatorId: string
) => {
  return db
    .table('communities')
    .get(id)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        slug,
        description,
      });
    })
    .then(obj => {
      return db
        .table('communities')
        .get(id)
        .update({ ...obj }, { returnChanges: true })
        .run()
        .then(result => result.changes[0].new_val);
    });
};

const deleteCommunity = id => {
  return db
    .table('communities')
    .get({ id })
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

module.exports = {
  getCommunities,
  getCommunitiesBySlug,
  getCommunityMetaData,
  getCommunitiesByUser,
  createCommunity,
  editCommunity,
  deleteCommunity,
  getAllCommunityStories,
};
