// @flow
const debug = require('debug')('pluto:webhooks:chargeEvent');
import type { ChargeEvent } from '../types/ChargeEvent';
import type { CleanCharge, RawCharge } from '../types/Charge';
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
    return replaceRecord(table, key, charge, filter);
  } else {
    return insertRecord(table, charge);
  }
};

export const ChargeEventFactory = {
  clean: (raw: RawCharge): CleanCharge => cleanCharge(raw),
  save: async (clean: CleanCharge): Promise<CleanCharge> =>
    await saveCharge(clean),
};

export const ChargeEventHandler = {};

const { clean, save } = ChargeEventFactory;

ChargeEventHandler.handle = async (
  event: ChargeEvent
): Promise<CleanCharge> => {
  debug(`Handling charge ${event.data.object.id}`);
  return await save(clean(event.data.object));
};
