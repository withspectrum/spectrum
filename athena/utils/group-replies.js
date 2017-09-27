
const groupReplies = replies => {
  let newReplies = [];
  replies.forEach((reply, index) => {
    if (
      replies[index - 1] && replies[index - 1].sender.id === reply.sender.id
    ) {
      newReplies[newReplies.length - 1].content.body =
        newReplies[newReplies.length - 1].content.body +
        '<p class="reply">' +
        reply.content.body +
        '</p>';
    } else {
      newReplies.push(reply);
    }
  });
  return newReplies;
};

export default groupReplies;
