// @flow
import { sortAndGroupMessages } from '../group-messages';

// TODO: FIXME
type Message = Object;

// 01.01.2017
const FIRST_JAN = 1483225200000;

const createMessage = ({
  timestamp,
  body,
  authorId,
  id,
}: {
  timestamp?: Date,
  body?: string,
  authorId?: string,
  id?: string | number,
}): Message => ({
  id: id || 'whatever',
  timestamp: timestamp || new Date(FIRST_JAN),
  content: {
    body: body || 'Hey',
  },
  author: {
    user: {
      id: authorId || 'asdf123',
    },
  },
  messageType: 'text',
});

const filterRobo = messageGroups =>
  messageGroups.filter(group => group[0].author.user.id !== 'robo');

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

it('should group messages by author', () => {
  const one = createMessage({
    authorId: 'first',
  });
  const two = createMessage({
    authorId: 'first',
  });
  const three = createMessage({
    authorId: 'second',
  });
  const four = createMessage({
    authorId: 'first',
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
  expect(result).toHaveLength(4);
  // Expect a robo text timestamp to be between the message groups
  expect(result[2][0].author.user.id).toEqual('robo');
});
