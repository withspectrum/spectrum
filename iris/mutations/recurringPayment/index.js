// @flow
require('now-env');
import UserError from '../utils/UserError';
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const stripe = require('stripe')(STRIPE_TOKEN),
  currency = 'USD';
import {
  createRecurringPayment,
  updateRecurringPayment,
  getUserRecurringPayments,
} from '../models/recurringPayment';
import {
  getMembersInCommunity,
  getUserPermissionsInCommunity,
} from '../models/usersCommunities';
import { getCommunities } from '../models/community';
import { getUserById } from '../models/user';

type UpgradeToProArguments = {
  input: {
    plan: string,
    token: string,
  },
};

import upgradeToPro from './upgradeToPro';
import downgradeFromPro from './downgradeFromPro';
import upgradeCommunity from './upgradeCommunity';
import downgradeCommunity from './downgradeCommunity';

module.exports = {
  Mutation: {
    upgradeToPro,
    downgradeFromPro,
    upgradeCommunity,
    downgradeCommunity,
  },
};
