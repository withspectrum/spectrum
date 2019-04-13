// @flow
import type { EntityTypes } from './types';
import { getMessageById } from '../models/message';
import { getThreadById } from '../models/thread';
import { getChannelById } from '../models/channel';
import { getCommunityById } from '../models/community';
import { getUserById } from 'shared/db/queries/user';
import { getDirectMessageThreadById } from '../models/directMessageThread';
const debug = require('debug')('athena:payloads');

/*
	Fetch a payload from the database when we only have access to an id.
	For example, when a message is sent we need to generate a payload for the
	entire thread object where the message was posted!
*/
export const fetchPayload = (
  type: EntityTypes,
  id: string
): Promise<Object> => {
  debug(`fetch payload for ${type.toLowerCase()}#${id}`);
  switch (type) {
    case 'MESSAGE': {
      return getMessageById(id).then(data => createPayload(type, data));
    }
    case 'THREAD': {
      return getThreadById(id).then(data => createPayload(type, data));
    }
    case 'CHANNEL': {
      return getChannelById(id).then(data => createPayload(type, data));
    }
    case 'COMMUNITY': {
      return getCommunityById(id).then(data => createPayload(type, data));
    }
    case 'USER': {
      return getUserById(id).then(data => createPayload(type, data));
    }
    case 'DIRECT_MESSAGE_THREAD': {
      return getDirectMessageThreadById(id).then(data =>
        createPayload(type, data)
      );
    }
    default: {
      console.error(`Couldn't match the type '${type}' with EntityTypes`);
      return Promise.resolve({});
    }
  }
};

export const createPayload = (type: EntityTypes, data: Object): Object =>
  debug(`create payload for ${type.toLowerCase()}#${data.id}`) || {
    type,
    id: data.id,
    payload: JSON.stringify(data),
  };
