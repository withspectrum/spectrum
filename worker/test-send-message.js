// Test sending a message with bull
const Queue = require('bull');

const messageNotificationQueue = new Queue('message notification');

messageNotificationQueue.add({ id: 'test' });
