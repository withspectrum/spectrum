import { getMessageById } from '../../models/message';
import { signImageUrl } from 'shared/imgix';
import escapehtml from 'escape-html';

export default async replies => {
  let newReplies = [];

  const replyPromises = replies.map(
    async reply => await getMessageById(reply.id)
  );

  // get all the messages for this thread
  const messageRecords = await Promise.all(replyPromises).catch(err =>
    console.error('error getting reply promises', err)
  );

  // filter deleted ones and sort them by recency
  const filteredMessageRecords = messageRecords
    .filter(message => !message.deletedAt)
    .sort((a, b) => a.timestamp > b.timestamp);

  const filteredPromises = filteredMessageRecords.map((message, index) => {
    const reply = replies.filter(r => r.id === message.id)[0];
    const body =
      message.messageType === 'media'
        ? // prettier-ignore
          `<p class='reply-img-container' style="background: #E6ECF7; margin-bottom: 2px; border-radius: 12px; overflow: hidden; display: block; max-width: 100%; margin-top: 0!important; color: #16171A;"><img class='reply-img' style="display: block;width: 100%;border-radius: 12px;" src='${signImageUrl(reply.content.body)}' /></p>`
        : // prettier-ignore
          `<p class='reply' style="font-weight: 400; font-size: 16px;background: #E6ECF7;margin-bottom: 2px;padding: 8px 12px;border-radius: 12px;display: block;max-width: 100%;margin-top: 0!important;color: #16171A;">${escapehtml(reply.content.body)}</p>`;

    const newGroup = {
      ...reply,
      content: {
        body,
      },
    };

    if (index === 0) return newReplies.push(newGroup);
    if (
      newReplies[newReplies.length - 1] &&
      newReplies[newReplies.length - 1].sender.id === message.senderId
    ) {
      newReplies[newReplies.length - 1].content.body += body;
      return;
    } else {
      newReplies.push(newGroup);
      return;
    }
  });

  return await Promise.all([filteredPromises])
    .then(() => newReplies)
    .catch(err => console.error('error getting filteredPromises', err));
};
