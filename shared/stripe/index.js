require('now-env');
const STRIPE_TOKEN = process.env.STRIPE_TOKEN;
const STRIPE_WEBHOOK_SIGNING_SECRET = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
export const stripe = require('stripe')(STRIPE_TOKEN);
export const stripeWebhookSigningSecret = STRIPE_WEBHOOK_SIGNING_SECRET;
