require('now-env');
const IS_PROD = process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV;
const STRIPE_TOKEN = IS_PROD
  ? process.env.STRIPE_TOKEN
  : process.env.STRIPE_TOKEN_DEVELOPMENT;
const STRIPE_WEBHOOK_SIGNING_SECRET = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
export const stripe = require('stripe')(STRIPE_TOKEN);
export const stripeWebhookSigningSecret = STRIPE_WEBHOOK_SIGNING_SECRET;
