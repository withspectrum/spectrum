// Test sending a message with bull
const Queue = require('bull');

const messageNotificationQueue = new Queue('message notification');

messageNotificationQueue.add({
  message: {
    attachments: [],
    content: {
      body: 'Testing!',
    },
    id: 'testing-id-1234',
    messageType: 'text',
    senderId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
    threadId: '73ee74ea-e98c-4b11-8afc-0c934785d807',
    threadType: 'story',
    timestamp: new Date(),
  },
  user: {
    id: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
  },
});
