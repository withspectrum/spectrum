// @flow
import sortByDate from '../sort-by-date';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';

type Output = {
  ...$Exact<MessageInfoType>,
  timestamp: string,
};

export const sortAndGroupMessages = (messages: Array<Output>) => {
  if (messages.length === 0) return [];
  messages = sortByDate(messages, 'timestamp', 'asc');
  let masterArray = [];
  let newArray = [];
  let checkId;

  for (let i = 0; i < messages.length; i++) {
    // on the first message, get the user id and set it to be checked against
    const robo = [
      {
        id: messages[i].timestamp,
        author: {
          user: {
            id: 'robo',
          },
        },
        timestamp: messages[i].timestamp,
        content: {
          body: messages[i].timestamp,
        },
        type: 'timestamp',
      },
    ];

    if (i === 0) {
      checkId = messages[i].author.user.id;
      masterArray.push(robo);
    }

    const sameUser =
      messages[i].author.user.id !== 'robo' &&
      messages[i].author.user.id === checkId;
    const oldMessage = (current: Object, previous: Object) => {
      //=> boolean
      /*
        Rethink db returns string timestamps. We need to convert them
        into a number format so that we can compare message timestamps
        more easily. .getTime() will convert something like:

        '2017-05-02T18:15:20.769Z'

        into:

        '1493748920.769'

        We then determine if the current message being evaluated is older
        than the previous evaulated message by a certain integer to determine
        if we should render a timestamp in the UI and create a new bubbleGroup
      */
      const c = new Date(current.timestamp).getTime();
      const p = new Date(previous.timestamp).getTime();
      return c > p + 3600000 * 6; // six hours;
    };

    // if we are evaulating a bubble from the same user
    if (sameUser) {
      // if we are still on the first message
      if (i === 0) {
        // push the message to the array
        newArray.push(messages[i]);
      } else {
        // if we're on to the second message, we need to evaulate the timestamp
        // if the second message is older than the first message by our variance
        if (oldMessage(messages[i], messages[i - 1])) {
          // push the batch of messages to master array
          masterArray.push(newArray);
          // insert a new robotext timestamp
          masterArray.push(robo);
          // reset the batch of new messages
          newArray = [];
          // populate the new batch of messages with this next old message
          newArray.push(messages[i]);
        } else {
          // if the message isn't older than our preferred variance,
          // we keep populating the same batch of messages
          newArray.push(messages[i]);
        }
      }
      // and maintain the checkid
      checkId = messages[i].author.user.id;
      // if the next message is from a new user
    } else {
      // we push the previous user's messages to the masterarray
      masterArray.push(newArray);
      // if the new users message is older than our preferred variance
      if (i > 0 && oldMessage(messages[i], messages[i - 1])) {
        // push a robo timestamp
        masterArray.push(robo);
        newArray = [];
        newArray.push(messages[i]);
      } else {
        // clear the messages array from the previous user
        newArray = [];
        // and start a new batch of messages from the currently evaluating user
        newArray.push(messages[i]);
      }

      // set a new checkid for the next user
      checkId = messages[i].author.user.id;
    }
  }

  // when done, push the final batch of messages to masterArray
  // masterArray.push(newArray);
  // and return masterArray to the component
  masterArray.push(newArray);
  return masterArray;
};
