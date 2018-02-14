// @flow
const debug = require('debug')('pluto:webhooks:sourceEvent');
import type { SourceEvent } from '../types/SourceEvent';
import type { CleanSource, RawSource } from '../types/source';
import { recordExists, insertRecord, replaceRecord } from '../models/utils';
import { resetCustomerSources } from '../models/stripeSources';

const cleanSource = (source: RawSource): CleanSource => {
  debug(`Cleaning source ${source.id}`);
  return Object.assign({}, source, {
    customerId: source.customer,
    sourceId: source.id,
  });
};

const saveSource = async (source: CleanSource): Promise<CleanSource> => {
  debug(`Saving source ${source.id}`);
  const table = 'stripeSources';
  const key = source.customerId;
  const filter = { customerId: key };

  if (await recordExists(table, key, filter)) {
    debug(`Source record exists, replacing ${source.id}`);
    return await replaceRecord(table, key, source, filter);
  } else {
    debug(`Source does not exist, inserting ${source.id}`);
    return await insertRecord(table, source);
  }
};

export const SourceEventFactory = {
  clean: (raw: RawSource): CleanSource => cleanSource(raw),
  save: async (clean: CleanSource): Promise<CleanSource> =>
    await saveSource(clean),
  resetCustomerSources: async (customerId: string) =>
    await resetCustomerSources(customerId),
};

export const SourceEventHandler = {};

const { clean, save } = SourceEventFactory;

SourceEventHandler.handle = async (
  event: SourceEvent
): Promise<CleanSource> => {
  debug(`Handling source ${event.data.object.id}`);
  return await save(clean(event.data.object)).catch(err => {
    console.log(`Error handling source event ${event.data.object.id}`);
    throw new Error(err);
  });
};
