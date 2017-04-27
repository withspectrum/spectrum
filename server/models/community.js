/**
 * Storing and retrieving communities
 */
const { db } = require('./db');
import { createFrequency } from './frequency';

const getCommunity = id => {
  return db.table('communities').get(id).run();
};

const getCommunitiesByUser = uid => {
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

module.exports = {
  getCommunity,
  getCommunityMetaData,
  getCommunitiesByUser,
  createCommunity,
};
