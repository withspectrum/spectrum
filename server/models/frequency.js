// @flow
/**
 * Storing and retrieving frequencies
 */
const { db } = require('./db');
import { UserError } from 'graphql-errors';

const getFrequenciesByCommunity = (community: string) => {
  return db.table('frequencies').filter({ community }).run();
};

const getFrequenciesByUser = (uid: string) => {
  return db
    .table('frequencies')
    .filter(frequency => frequency('subscribers').contains(uid))
    .run();
};

const getFrequencyById = (id: string) => db.table('frequencies').get(id).run();

const getFrequencyBySlug = (slug: string, community: string) => {
  return db
    .table('frequencies')
    .eqJoin('community', db.table('communities'))
    .filter({
      left: {
        slug: slug,
      },
      right: {
        slug: community,
      },
    })
    .run()
    .then(result => result && result[0].left);
};

export type GetFrequencyArgs = {
  id?: string,
  slug?: string,
  community?: string,
};

const getFrequency = ({ id, slug, community }: GetFrequencyArgs) => {
  if (id) return getFrequencyById(id);
  if (slug && community) return getFrequencyBySlug(slug, community);

  throw new UserError(
    'Please provide either id or slug and community to your frequency() query.'
  );
};

const getFrequencyMetaData = (id: String) => {
  const getStoryCount = db
    .table('stories')
    .filter({ frequency: id })
    .count()
    .run();
  const getSubscriberCount = db
    .table('frequencies')
    .get(id)
    .getField('subscribers')
    .count()
    .run();

  return Promise.all([getStoryCount, getSubscriberCount]);
};

type CreateFrequencyType = {
  creatorId: string,
  communityId: string,
  name: string,
  description: string,
  slug: string,
};

const createFrequency = ({
  creatorId,
  communityId,
  name,
  description,
  slug,
}: CreateFrequencyType) => {
  return db
    .table('frequencies')
    .insert({
      name,
      description,
      slug,
      createdAt: new Date(),
      modifiedAt: new Date(),
      community: communityId,
      subscribers: [creatorId],
    })
    .run();
};

const getTopFrequencies = (amount: number) => {
  return db
    .table('frequencies')
    .orderBy(db.desc('subscribers'))
    .limit(amount)
    .run();
};

const getFrequencySubscriberCount = (id: string) => {
  return db.table('frequencies').get(id)('subscribers').count().run();
};

module.exports = {
  getFrequency,
  getFrequencyMetaData,
  getFrequenciesByUser,
  getFrequenciesByCommunity,
  createFrequency,
  getTopFrequencies,
  getFrequencySubscriberCount,
};
