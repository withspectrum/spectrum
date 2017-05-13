// @flow
/**
 * Storing and retrieving frequencies
 */
const { db } = require('./db');
import { UserError } from 'graphql-errors';

const getFrequenciesByCommunity = (community: string) => {
  return db
    .table('frequencies')
    .getAll(community, { index: 'community' })
    .filter(frequency => db.not(frequency.hasFields('deleted')))
    .run();
};

const getFrequenciesByUser = (uid: string) => {
  return db
    .table('frequencies')
    .filter(frequency => frequency('subscribers').contains(uid))
    .filter(frequency => db.not(frequency.hasFields('deleted')))
    .run();
};

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
    .filter(frequency => db.not(frequency.hasFields('deleted')))
    .run()
    .then(result => {
      if (result && result[0]) {
        return result[0].left;
      }
    });
};

type GetFrequencyByIdArgs = {
  id: string,
};

type GetFrequencyBySlugArgs = {
  slug: string,
  community: string,
};

export type GetFrequencyArgs = GetFrequencyByIdArgs | GetFrequencyBySlugArgs;

const getFrequencies = (ids: Array<string>) => {
  return db
    .table('frequencies')
    .getAll(...ids)
    .filter(frequency => db.not(frequency.hasFields('deleted')))
    .run();
};

const getFrequencyMetaData = (id: string) => {
  const getStoryCount = db
    .table('stories')
    .getAll(id, { index: 'frequency' })
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

export type CreateFrequencyArguments = {
  input: {
    community: string,
    name: string,
    description: string,
    slug: string,
  },
};

export type EditFrequencyArguments = {
  input: {
    id: string,
    name: string,
    description: string,
    slug: string,
  },
};

const createFrequency = (
  { input: { community, name, slug, description } }: CreateFrequencyArguments,
  creatorId: string
) => {
  return db
    .table('frequencies')
    .insert(
      {
        name,
        description,
        slug,
        createdAt: new Date(),
        modifiedAt: new Date(),
        community,
        subscribers: [creatorId],
        owners: [creatorId],
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const editFrequency = ({
  input: { name, slug, description, id },
}: EditFrequencyArguments) => {
  return db
    .table('frequencies')
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
        .table('frequencies')
        .get(id)
        .update({ ...obj }, { returnChanges: 'always' })
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
const deleteFrequency = id => {
  return db
    .table('frequencies')
    .get(id)
    .update(
      {
        deleted: db.now(),
        slug: db.uuid(),
      },
      {
        returnChanges: true,
        nonAtomic: true,
      }
    )
    .run()
    .then(result => {
      // update was successful
      if (result.replaced >= 1) {
        return true;
      }

      // update failed
      return new Error(
        "Something went wrong and we weren't able to delete this frequency."
      );
    });
};

const unsubscribeFrequency = (id, uid) => {
  return db
    .table('frequencies')
    .get(id)
    .update(
      row => ({
        subscribers: row('subscribers').filter(item => item.ne(uid)),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        changes.length > 0
          ? changes[0].new_val
          : db.table('frequencies').get(id).run()
    );
};

const subscribeFrequency = (id, uid) => {
  return db
    .table('frequencies')
    .get(id)
    .update(
      row => ({
        subscribers: row('subscribers').append(uid),
      }),
      { returnChanges: true }
    )
    .run()
    .then(
      ({ changes }) =>
        changes.length > 0
          ? changes[0].new_val
          : db.table('frequencies').get(id).run()
    );
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
  getFrequencyBySlug,
  getFrequencyMetaData,
  getFrequenciesByUser,
  getFrequenciesByCommunity,
  createFrequency,
  editFrequency,
  deleteFrequency,
  unsubscribeFrequency,
  subscribeFrequency,
  getTopFrequencies,
  getFrequencySubscriberCount,
  getFrequencies,
};
