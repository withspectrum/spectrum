// @flow
import { request } from '../../utils';
import db from 'shared/testing/db';
import data from 'shared/testing/data';
import {
  fromPlainText,
  toJSON,
  toPlainText,
  toState,
} from 'shared/draft-utils';

const query = /* GraphQL */ `
  mutation sendMessage($message: MessageInput!) {
    addMessage(message: $message) {
      content {
        body
      }
    }
  }
`;

describe('story', () => {
  // Find a member of a community
  const userCommunity = data.usersCommunities.find(({ isMember }) => isMember);
  const user = data.users.find(({ id }) => id === userCommunity.userId);
  // Find a thread in the community
  const thread = data.threads.find(
    ({ communityId }) => communityId === userCommunity.communityId
  );

  const newMessage = {
    threadId: thread.id,
    threadType: 'story',
    messageType: 'draftjs',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A new message yayzers'))),
    },
  };

  afterEach(() => {
    return Promise.all([
      db
        .table('messages')
        .filter({ content: { body: newMessage.content.body } })
        .delete()
        .run(),
      db
        .table('threads')
        .get(thread.id)
        .update(thread)
        .run(),
    ]);
  });

  it('should add a new message to the database', async () => {
    const context = { user };
    const variables = { message: newMessage };
    expect.hasAssertions();
    const result = await request(query, { context, variables });
    expect(result.data.addMessage.content.body).toEqual(
      newMessage.content.body
    );
  });

  it("should not allow users who aren't members to send a message", async () => {
    const context = { user: null };
    const variables = { message: newMessage };
    expect.hasAssertions();
    const result = await request(query, { context, variables });
    expect(result.data.addMessage).toEqual(null);
    expect(result.errors.length).toEqual(1);
  });
});

describe('directMessageThread', () => {
  // Find a member of a dm thread
  const userDmThread = data.usersDirectMessageThreads[0];
  const user = data.users.find(({ id }) => id === userDmThread.userId);
  const dmThread = data.directMessageThreads.find(
    ({ id }) => id === userDmThread.threadId
  );

  const newMessage = {
    threadId: userDmThread.threadId,
    threadType: 'directMessageThread',
    messageType: 'draftjs',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A new message yayzers'))),
    },
  };

  afterEach(() => {
    return Promise.all([
      db
        .table('messages')
        .filter({ content: { body: newMessage.content.body } })
        .delete()
        .run(),
      db
        .table('directMessageThreads')
        .get(userDmThread.threadId)
        .update(dmThread)
        .run(),
    ]);
  });

  it('should add a new message to the database', async () => {
    const context = { user };
    const variables = { message: newMessage };
    expect.hasAssertions();
    const result = await request(query, { context, variables });
    expect(result.data.addMessage.content.body).toEqual(
      newMessage.content.body
    );
  });

  it("should not allow users who aren't members to send a message", async () => {
    const context = { user: null };
    const variables = { message: newMessage };
    expect.hasAssertions();
    const result = await request(query, { context, variables });
    expect(result.data.addMessage).toEqual(null);
    expect(result.errors.length).toEqual(1);
  });
});
