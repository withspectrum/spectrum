import type { EntityTypes } from './types';
import { getMessageById } from '../models/message';
import { getThreadById } from '../models/thread';
import { getChannelById } from '../models/channel';
import { getCommunityById } from '../models/community';
import { getUserById } from '../models/user';
import { getDirectMessageThreadById } from '../models/directMessageThread';

/*
  Fetch a payload from the database when we only have access to an id.
  For example, when a message is sent we need to generate a payload for the
  thread where the message was posted!
*/
export const fetchPayload = (
  type: EntityTypes,
  id: Object
): Promise<Object> => {
  /*
    Function receives a type, and depending on the type we need to get a different
    entity from the idbase. This switch statement determines which model
    function to use
  */

  console.log('fetching payload with', type, id);

  let getEntityByType;
  switch (type) {
    case 'MESSAGE': {
      return getMessageById(id).then(result => {
        return createPayload(type, result);
      });
      break;
    }
    case 'THREAD': {
      return getThreadById(id).then(result => {
        return createPayload(type, result);
      });
      break;
    }
    case 'CHANNEL': {
      return getChannelById(id).then(result => {
        return createPayload(type, result);
      });
      break;
    }
    case 'COMMUNITY': {
      return getCommunityById(id).then(result => {
        return createPayload(type, result);
      });
      break;
    }
    case 'USER': {
      return getUserById(id).then(result => {
        return createPayload(type, result);
      });
      break;
    }
    case 'DIRECT_MESSAGE_THREAD': {
      return getDirectMessageThreadById(id).then(result => {
        return createPayload(type, result);
      });
      break;
    }
    default: {
      console.log(`Couldn't match the type '${type}' with EntityTypes`);
    }
  }
};

/*
  Create a payload with a final data object and type.
*/
export const createPayload = (type: EntityTypes, data: Object): Object => {
  return {
    type,
    id: data.id,
    payload: JSON.stringify(data),
  };
};
