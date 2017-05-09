// @flow
/**
 * Storing and retrieving communities
 */
const { db } = require('./db');
import { UserError } from 'graphql-errors';
import { createFrequency } from './frequency';

export type GetCommunityArgs = {
  id?: string,
  slug?: string,
};

const getCommunity = ({ id, slug }: GetCommunityArgs) => {
  if (id) return getCommunityById(id);
  if (slug) return getCommunityBySlug(slug);

  throw new UserError(
    'Please provide either id or slug to the communities() query.'
  );
};

const getCommunityById = (id: string) => db.table('communities').get(id).run();

const getCommunityBySlug = (slug: string) => {
  return db
    .table('communities')
    .filter({ slug })
    .run()
    .then(result => result && result[0]);
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
  name: string,
  slug: string,
};

const createCommunity = (
  { name, slug }: CreateCommunityArguments,
  creatorId: string
) => {
  return db
    .table('communities')
    .insert(
      {
        createdAt: new Date(),
        slug,
        name,
        members: [creatorId],
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(community =>
      Promise.all([
        community,
        createFrequency({
          name: 'General',
          slug: 'general',
          description: 'General Chatter',
          creatorId,
          communityId: community.id,
        }),
      ])
    )
    .then(([community]) => community);
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
  getCommunity,
  getCommunityMetaData,
  getCommunitiesByUser,
  createCommunity,
  getAllCommunityStories,
};
