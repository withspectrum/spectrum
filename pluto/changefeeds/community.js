// @flow
const debug = require('debug')('pluto:changefeeds:community');
import {
  listenToNewDocumentsIn,
  listenToChangedFieldIn,
  listenToDeletedDocumentsIn,
} from 'shared/changefeed-utils';
import { stripe } from 'shared/stripe';
import type { DBCommunity } from 'shared/types';
import { db } from '../models/db';

// when a community is created, generate a new customer for that community
// we do this pre-emptively
export const newCommunity = () =>
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
export const editedCommunity = () =>
  listenToChangedFieldIn(db, 'modifiedAt')(
    'communities',
    async (community: DBCommunity) => {
      const {
        stripeCustomerId,
        id: communityId,
        name: communityName,
      } = community;

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
export const deletedCommunity = () =>
  listenToDeletedDocumentsIn(
    db,
    'communities',
    async (community: DBCommunity) => {
      const { stripeCustomerId } = community;

      debug('Deleting Stripe customer');

      return await stripe.customers.del(stripeCustomerId);
    }
  );
