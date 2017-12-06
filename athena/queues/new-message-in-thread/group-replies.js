import { getMessageById } from '../../models/message';

export default async replies => {
  let newReplies = [];

  const replyPromises = replies.map(
    async reply => await getMessageById(reply.id)
  );

  // get all the messages for this thread
  const messageRecords = await Promise.all(replyPromises).catch(err =>
    console.log('error getting reply promises', err)
  );

  // filter deleted ones and sort them by recency
  const filteredMessageRecords = messageRecords
    .filter(message => !message.deletedAt)
    .sort((a, b) => a.timestamp > b.timestamp);

  const filteredPromises = filteredMessageRecords.map((message, index) => {
    const reply = replies.filter(r => r.id === message.id)[0];
    const body =
      message.messageType === 'media'
        ? `<p class='reply-img-container'><img class='reply-img' src='${reply
            .content.body}?w=600&dpr=2' /></p>`
        : `<p class='reply'>${reply.content.body}</p>`;

    const newGroup = {
      ...reply,
      content: {
        body,
      },
    };

    if (index === 0) return newReplies.push(newGroup);
    if (reply.sender.id === message.senderId) {
      newReplies[newReplies.length - 1].content.body += body;
      return;
    } else {
      newReplies.push(newGroup);
      return;
    }
  });

  return await Promise.all([filteredPromises])
    .then(() => newReplies)
    .catch(err => console.log('error getting filteredPromises', err));
};
