// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  makeMemberModeratorInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { getStripeCustomer } from '../../models/stripeCustomers';
import { stripe } from 'shared/stripe';

type Input = {
  input: {
    userId: string,
    communityId: string,
  },
};

export default async (_: any, { input }: Input, { user }: GraphQLContext) => {
  const currentUser = user;
  const { communityId, userId: userToEvaluateId } = input;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to manage moderators in this community.'
    );
  }

  const [
    currentUserPermissions,
    userToEvaluatePermissions,
    community,
  ] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, currentUser.id),
    checkUserPermissionsInCommunity(communityId, userToEvaluateId),
    getCommunityById(communityId),
  ]);

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  const { stripeCustomerId } = community;
  if (!stripeCustomerId)
    return new UserError(
      'You must have a valid payment method for this community to add new moderators'
    );

  /*

    At this point we know the user has a stripe customer created
    We need to know the following:

    1. Do they have a chargeable source on file?
    2. Do they have an active subscription already?
    3. If they have an active subscription, do they have a subscription item for
       moderator seats?

    1a. If they don't have a chargeable source, this fails and we push them to the billing page
    1b. If they have a chargeable source, continue

    2a. If they don't have an active subscription, we will create a new subscription (this is their first payment event!)
    2b. If they have an active subscription, continue

    3a. If they already have an active subscription, and they don't have a subscription item for moderator seats, we will add a new 
        subscription item to their existing subscription
    3b. If they have an active subscription and they have a subscription item for moderator seats, we will increment the count on the
        subscription item
  */

  const customer = await getStripeCustomer(stripeCustomerId);

  if (!customer) {
    return new UserError('No customer created yet somehow...');
  }

  const sources = customer.sources.data;
  const subscriptions = customer.subscriptions.data;

  // 1
  console.log('1');
  if (
    !sources ||
    sources.length === 0 ||
    !sources.some(source => source.status === 'chargeable')
  ) {
    // 1a
    console.log('1a');
    return new UserError(
      'You must have a valid payment method for this community to add new moderators'
    );
  }

  // 2
  console.log('2');
  if (!subscriptions || subscriptions.length === 0) {
    // 2a
    console.log('2a');
    stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        // NOTE: We have to include this dummy item in order to prevent
        // the top-level subscription from thinking it's about any
        // specific feature
        {
          plan: 'community-features',
          quantity: 1,
        },
        {
          plan: 'moderator-seat',
          quantity: 1,
        },
      ],
    });
  }

  // 3
  console.log('3');
  if (subscriptions && subscriptions.length > 0) {
    const subscriptionToEvaluate = subscriptions[0];
    console.log('subscriptionToEvaluate', subscriptionToEvaluate);
    const hasModeratorSeatItem = subscriptionToEvaluate.items.data.some(
      sub => sub.plan.id === 'moderator-seat'
    );

    if (!hasModeratorSeatItem) {
      // 3a
      console.log('3a');
      stripe.subscriptionItems.create({
        subscription: subscriptionToEvaluate.subscriptionId,
        plan: 'moderator-seat',
        quantity: 1,
      });
    } else {
      // 3b
      console.log('3b');
      console.log('data', subscriptionToEvaluate.items.data);
      const subscriptionItem = subscriptionToEvaluate.items.data.filter(
        sub => sub.plan.id === 'moderator-seat'
      )[0];
      console.log('subscriptionItem', subscriptionItem);
      const result = await stripe.subscriptionItems.update(
        subscriptionItem.id,
        {
          quantity: subscriptionItem.quantity + 1,
        }
      );
      console.log('result ', result);
    }
  }

  // if no permissions exist, the user performing this mutation isn't even
  // a member of this community
  if (!currentUserPermissions || currentUserPermissions.length === 0) {
    return new UserError('You must own this community to manage moderators.');
  }

  if (!userToEvaluatePermissions || userToEvaluatePermissions === 0) {
    return new UserError(
      'This person must be a member of the community before becoming a moderator.'
    );
  }

  const currentUserPermission = currentUserPermissions[0];
  const userToEvaluatePermission = userToEvaluatePermissions[0];

  // it's possible for a member to be moving from blocked -> moderator
  // in this situation, they are isMember: false, but they are technically a
  // member of the community - just blocked. By checking to ensure if isMember
  // and isBlocked are both false, we ensure that the user is not in any way
  // in a relationship with the community
  if (
    !userToEvaluatePermission.isMember &&
    !userToEvaluatePermission.isBlocked
  ) {
    return new UserError(
      'This person must be a member of the community before becoming a moderator.'
    );
  }

  if (userToEvaluatePermission.isModerator) {
    return new UserError(
      'This person is already a moderator in your community.'
    );
  }

  if (!currentUserPermission.isOwner) {
    return new UserError('You must own this community to manage moderators.');
  }

  // all checks pass
  if (currentUserPermission.isOwner) {
    return await makeMemberModeratorInCommunity(
      communityId,
      userToEvaluateId
    ).catch(err => new UserError(err));
  }

  return new UserError(
    "We weren't able to process your request to add a moderator to this community."
  );
};
