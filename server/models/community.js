// @flow
/**
 * Storing and retrieving communities
 */
const { db } = require('./db');
import { UserError } from 'graphql-errors';

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

module.exports = {
  getCommunity,
  getCommunitiesByUser,
};
