// @flow
const debug = require('debug')('pluto:changefeeds:community');
import {
  listenToNewDocumentsIn,
  listenToChangedFieldIn,
  listenToNewFieldIn,
  listenToDeletedDocumentsIn,
} from 'shared/changefeed-utils';
import { stripe } from 'shared/stripe';
import type { DBCommunity } from 'shared/types';
import { db } from '../models/db';

// when a community is created, generate a new customer for that community
// we do this pre-emptively
export const communityCreated = () =>
  listenToNewDocumentsIn(db, 'communities', async (community: DBCommunity) => {
    // make sure we never duplicate customers
    const {
      stripeCustomerId,
      administratorEmail,
      id: communityId,
      name: communityName,
    } = community;

    if (stripeCustomerId) {
      debug('Stripe customer id already exists for community');
      return;
    }

    // every time a new community is created, create a stripe customer
    const { id: createdStripeId } = await stripe.customers.create({
      email: administratorEmail,
      metadata: {
        communityId,
        communityName,
      },
    });

    debug('Creating new Stripe customer');

    return db
      .table('communities')
      .get(communityId)
      .update({
        stripeCustomerId: createdStripeId,
      })
      .run();
  });

// keep the name of the community in sync on stripe
export const communityEdited = () =>
  listenToChangedFieldIn(db, 'name')(
    'communities',
    async (community: DBCommunity) => {
      const {
        stripeCustomerId,
        administratorEmail,
        id: communityId,
        name: communityName,
      } = community;

      if (!stripeCustomerId) {
        debug('Community edited, but Stripe customer hasnt been created yet');
        if (administratorEmail) {
          debug('Community edited, admin email available to create customer');
          const { id: createdStripeId } = await stripe.customers.create({
            email: administratorEmail,
            metadata: {
              communityId,
              communityName,
            },
          });

          return db
            .table('communities')
            .get(communityId)
            .update({
              stripeCustomerId: createdStripeId,
            })
            .run();
        }
      }

      debug('Editing Stripe customer metadata');

      return await stripe.customers.update(stripeCustomerId, {
        metadata: {
          communityId,
          communityName,
        },
      });
    }
  );

// if a community is deleted on spectrum, deleting the customer on stripe will automatically
// close out all active subscriptions
export const communityDeleted = () =>
  listenToDeletedDocumentsIn(
    db,
    'communities',
    async (community: DBCommunity) => {
      const { stripeCustomerId } = community;

      debug('Deleting Stripe customer');

      return await stripe.customers.del(stripeCustomerId);
    }
  );

/* 
  if the administratorEmail field is changed, it means that it is either
  1. being added for the first time
  2. being updated because the user wants receipts to go to a new location

  If 1, we should create a customer
  If 2, we should update the customer
*/
const handleAdminEmailChange = async (community: DBCommunity) => {
  // make sure we never duplicate customers
  const {
    stripeCustomerId,
    administratorEmail,
    id: communityId,
    name: communityName,
  } = community;

  // 2. Update the existing customer
  if (stripeCustomerId) {
    debug('Updating email for Stripe customer');

    return await stripe.customers.update(stripeCustomerId, {
      email: administratorEmail,
    });
  }

  debug('Creating new Stripe customer from changed administratorEmail');

  // 1. Email is being added for the first time
  const { id: createdStripeId } = await stripe.customers.create({
    email: administratorEmail,
    metadata: {
      communityId,
      communityName,
    },
  });

  return db
    .table('communities')
    .get(communityId)
    .update({
      stripeCustomerId: createdStripeId,
    })
    .run();
};

export const communityAdministratorEmailChanged = () =>
  listenToChangedFieldIn(db, 'administratorEmail')(
    'communities',
    async (community: DBCommunity) => {
      debug('Changed administratorEmail field');

      return await handleAdminEmailChange(community);
    }
  );

export const communityAdministratorEmailCreated = () =>
  listenToNewFieldIn(db, 'administratorEmail')(
    'communities',
    async (community: DBCommunity) => {
      debug('New administratorEmail field');

      return await handleAdminEmailChange(community);
    }
  );
