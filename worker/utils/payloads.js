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
  data: Object
): Promise<Object> => {
  /*
    Function receives a type, and depending on the type we need to get a different
    entity from the database. This switch statement determines which model
    function to use
  */
  let getEntityByType;
  switch (type) {
    case 'message': {
      getEntityByType = getMessageById;
      break;
    }
    case 'thread': {
      getEntityByType = getThreadById;
      break;
    }
    case 'channel': {
      getEntityByType = getChannelById;
      break;
    }
    case 'community': {
      getEntityByType = getCommunityById;
      break;
    }
    case 'user': {
      getEntityByType = getUserById;
      break;
    }
    case 'directMessageThread': {
      getEntityByType = getDirectMessageThreadById;
      break;
    }
    default: {
      console.log(`Couldn't match the type '${type}' with EntityTypes`);
    }
  }

  /*
    When we have the proper model function to use, we can get an entity by id
    and return a consistent 'entities' object into the notification
  */
  return getEntityByType(data.id).then(data => createPayload(type, data));
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
