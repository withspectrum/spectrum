// @flow
const debug = require('debug')('pluto:webhooks:chargeEvent');
import type { CleanCharge, RawCharge } from 'shared/stripe/types/Charge';
import type { Job, StripeWebhookEventJobData } from 'shared/bull/types';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';

const cleanCharge = (charge: RawCharge): CleanCharge => {
  debug(`Cleaning charge ${charge.id}`);
  return Object.assign({}, charge, {
    customerId: charge.customer,
    chargeId: charge.id,
  });
};

const saveCharge = async (charge: CleanCharge): Promise<CleanCharge> => {
  debug(`Saving charge ${charge.id}`);
  const table = 'stripeCharges';
  const key = charge.customerId;
  const filter = { customerId: key };

  if (await recordExists(table, key, filter)) {
    debug(`Charge record exists, replacing ${charge.id}`);
    return await replaceRecord(table, key, charge, filter);
  } else {
    debug(`Charge record does not exist, inserting ${charge.id}`);
    return await insertRecord(table, charge);
  }
};

export const ChargeEventFactory = {
  clean: (raw: RawCharge): CleanCharge => cleanCharge(raw),
  save: async (clean: CleanCharge): Promise<CleanCharge> =>
    await saveCharge(clean),
};

export const ChargeEventHandler = {};

const { clean, save } = ChargeEventFactory;

ChargeEventHandler.handle = async (raw: RawCharge): Promise<CleanCharge> => {
  debug(`Handling charge ${raw.id}`);
  const cleaned = clean(raw);
  const saved = await save(cleaned);
  return saved.catch(err => {
    console.log(`Error handling charge event ${raw.id}`);
    throw new Error(err);
  });
};

export default async (job: Job<StripeWebhookEventJobData>) => {
  const { data: { record } } = job;
  debug(`New job for ${record.id}`);
  return await ChargeEventHandler.handle(record);
};
