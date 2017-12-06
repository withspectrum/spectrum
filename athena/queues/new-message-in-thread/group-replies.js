import { getMessageById } from '../../models/message';

// // @flow
// export default async replies => {
//   let newReplies = [];
//   let replyPromises = replies.map(async (reply, index) => {
//     console.log('TOP INDEX', index);
//     // for each message, make sure it still exists in the database
//     return await getMessageById(reply.id)
//       .then(messageRecord => {
//         // if the message was deleted, don't include it in the email
//       console.log('index', index);
//       if (messageRecord.deletedAt) {
//         return Promise.resolve();
//       } else {
//         if (
//           replies[index - 1] &&
//           replies[index - 1].sender.id === reply.sender.id
//         ) {
//           console.log('ONE', newReplies);
//           console.log('ONE REPLIES', replies);
//           console.log('ONE INDEX', index);
//           newReplies[newReplies.length - 1].content.body =
//             newReplies[newReplies.length - 1].content.body +
//             '<p class="reply">' +
//             reply.content.body +
//             '</p>';
//           return Promise.resolve();
//         } else {
//           console.log('TWO', newReplies);
//           console.log('TWO REPLIES', replies);
//           console.log('TWO INDEX', index);
//           newReplies.push(reply);
//           return Promise.resolve();
//         }
//       }
//       });

//   });

//   return await Promise.all([ ...replyPromises])
//     .then(replies => console.log('GROUPED REPLIES', replies) || newReplies)
//     .catch(err => console.log('error grouping replies', err));
// };

export default async replies => {
  let newReplies = [];

  const replyPromises = replies.map(
    async reply => await getMessageById(reply.id)
  );

  const messageRecords = await Promise.all(replyPromises).catch(err =>
    console.log('error getting reply promises', err)
  );

  console.log('\n message records', messageRecords);

  const filteredMessageRecords = messageRecords
    .filter(message => !message.deletedAt)
    .sort((a, b) => a.timestamp > b.timestamp);

  const filteredPromises = filteredMessageRecords.map((message, index) => {
    const reply = replies.filter(r => r.id === message.id)[0];
    if (index === 0) return newReplies.push(reply);
    if (reply.sender.id === message.senderId) {
      newReplies[
        newReplies.length - 1
      ].content.body += `<p class='reply'>${reply.content.body}</p>`;
      return;
    } else {
      newReplies.push(reply);
      return;
    }
  });
  console.log('newReplies first', newReplies);
  return await Promise.all([filteredPromises])
    .then(() => console.log('newReplies second', newReplies) || newReplies)
    .catch(err => console.log('error gettin filtered shit', err));
};
