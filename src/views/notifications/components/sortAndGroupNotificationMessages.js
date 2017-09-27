import { sortByDate } from '../../../helpers/utils';

export const sortAndGroupNotificationMessages = messagesToSort => {
  if (!messagesToSort.length > 0) return [];
  let messages = messagesToSort;
  messages = sortByDate(messages, 'timestamp', 'asc');
  let masterArray = [];
  let newArray = [];
  let checkId;

  for (let i = 0; i < messages.length; i++) {
    // on the first message, get the user id and set it to be checked against
    if (i === 0) {
      checkId = messages[i].senderId;
    }

    const sameUser = messages[i].senderId === checkId; //=> boolean
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
      return c > p + 21600000;
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
          // reset the batch of new messages
          newArray = [];
          // populate the new batch of messages with this next old message
          newArray.push(messages[i]);
        } else {
          // if the message isn't older than our prefered variance,
          // we keep populating the same batch of messages
          newArray.push(messages[i]);
        }
      }
      // and maintain the checkid
      checkId = messages[i].senderId;
      // if the next message is from a new user
    } else {
      // we push the previous user's messages to the masterarray
      masterArray.push(newArray);
      // if the new users message is older than our preferred variance
      if (i > 0 && oldMessage(messages[i], messages[i - 1])) {
        newArray = [];
        newArray.push(messages[i]);
      } else {
        // clear the messages array from the previous user
        newArray = [];
        // and start a new batch of messages from the currently evaulating user
        newArray.push(messages[i]);
      }

      // set a new checkid for the next user
      checkId = messages[i].senderId;
    }
  }

  // when done, push the final batch of messages to masterArray
  // masterArray.push(newArray);
  // and return masterArray to the component
  masterArray.push(newArray);
  return masterArray;
};
