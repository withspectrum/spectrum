// @flow
import { sortAndGroupMessages } from '../messages';

// TODO: FIXME
type Message = Object;

// 01.01.2017
const FIRST_JAN = 1483225200000;

const createMessage = ({
  timestamp,
  body,
  senderId,
}: {
  timestamp?: Date,
  body?: string,
  senderId?: string,
}): Message => ({
  id: 'whatever',
  timestamp: timestamp || new Date(FIRST_JAN),
  content: {
    body: body || 'Hey',
  },
  sender: {
    id: senderId || 'asdf123',
  },
  messageType: 'text',
});

const filterRobo = messageGroups =>
  messageGroups.filter(group => group[0].sender.id !== 'robo');

it('should sort messages by timestamp', () => {
  const one = createMessage({
    timestamp: new Date(FIRST_JAN - 10000),
    body: 'First',
  });
  const two = createMessage({
    timestamp: new Date(FIRST_JAN),
    body: 'Second',
  });
  const messages = [two, one];

  expect(filterRobo(sortAndGroupMessages(messages))).toEqual([[one, two]]);
});

it('should group messages by sender', () => {
  const one = createMessage({
    senderId: 'first',
  });
  const two = createMessage({
    senderId: 'first',
  });
  const three = createMessage({
    senderId: 'second',
  });
  const four = createMessage({
    senderId: 'first',
  });

  const messages = [one, two, three, four];

  expect(filterRobo(sortAndGroupMessages(messages))).toEqual([
    [one, two],
    [three],
    [four],
  ]);
});

it('should add a timestamp above the first message', () => {
  const timestamp = new Date(FIRST_JAN);
  const messages = [createMessage({ timestamp })];

  expect(sortAndGroupMessages(messages)).toMatchSnapshot();
});

const SEVEN_HOURS = 25200000;
it("should add a timestamp between two messages if there's more than six hours between them", () => {
  const first = createMessage({
    timestamp: new Date(FIRST_JAN),
  });
  const second = createMessage({
    timestamp: new Date(FIRST_JAN + SEVEN_HOURS),
  });

  const messages = [first, second];

  const result = sortAndGroupMessages(messages);

  // Should have three message groups, two robo texts + two groups
  expect(result.length).toEqual(4);
  // Expect a robo text timestamp to be between the message groups
  expect(result[2][0].sender.id).toEqual('robo');
});

describe('lastSeen', () => {
  it('should insert a last seen timestamp between two messages from different users', () => {
    const first = createMessage({
      timestamp: new Date(FIRST_JAN),
      senderId: 'first',
    });
    const second = createMessage({
      // Second one is 5000ms after first one
      timestamp: new Date(FIRST_JAN + 5000),
      senderId: 'second',
    });

    const messages = [first, second];

    // lastSeen is 2500 after first one
    const result = sortAndGroupMessages(messages, FIRST_JAN + 2500);

    // Between the two messages should be an unseen timestamp
    expect(result[2][0].sender.id).toEqual('robo');
    expect(result[2][0].message.type).toEqual('unseen-messages-below');
  });

  // NOTE(@mxstbr): This is a bug, is fixed in #2192, can remove the .skip here after that's merged
  it.skip(
    'should only insert one last seen robotext between messages from different users',
    () => {
      const first = createMessage({
        timestamp: new Date(FIRST_JAN),
        senderId: 'first',
      });
      const second = createMessage({
        timestamp: new Date(FIRST_JAN + 5000),
        senderId: 'second',
      });
      const third = createMessage({
        timestamp: new Date(FIRST_JAN + 6000),
        senderId: 'second',
      });

      const messages = [first, second, third];

      const result = sortAndGroupMessages(messages, FIRST_JAN + 2500);

      // Even though there's two unseen messages there should only be one robotext
      const robotexts = result.filter(
        group =>
          group[0].sender.id === 'robo' &&
          group[0].message.type === 'unseen-messages-below'
      );
      expect(robotexts.length).toEqual(1);
    }
  );

  it('should insert a last seen robotext between messages from the same user', () => {
    const first = createMessage({
      timestamp: new Date(FIRST_JAN),
    });
    const second = createMessage({
      // Second one is 5000ms after first one
      timestamp: new Date(FIRST_JAN + 5000),
    });

    const messages = [first, second];

    // lastSeen is 2500 after first one
    const result = sortAndGroupMessages(messages, FIRST_JAN + 2500);

    // Between the two messages should be an unseen timestamp
    expect(result[2][0].sender.id).toEqual('robo');
    expect(result[2][0].message.type).toEqual('unseen-messages-below');
  });

  it('should only insert one last seen robotext between messages from the same user', () => {
    const first = createMessage({
      timestamp: new Date(FIRST_JAN),
    });
    const second = createMessage({
      // Second one is 5000ms after first one
      timestamp: new Date(FIRST_JAN + 5000),
    });
    const third = createMessage({
      timestamp: new Date(FIRST_JAN + 6000),
    });

    const messages = [first, second, third];

    // lastSeen is 2500 after first one
    const result = sortAndGroupMessages(messages, FIRST_JAN + 2500);

    // Even though there's two unseen messages there should only be one robotext
    const robotexts = result.filter(
      group =>
        group[0].sender.id === 'robo' &&
        group[0].message.type === 'unseen-messages-below'
    );
    expect(robotexts.length).toEqual(1);
  });
});
