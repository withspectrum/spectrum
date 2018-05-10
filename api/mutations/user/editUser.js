// @flow
import type { GraphQLContext } from '../../';
import type { EditUserInput } from '../../models/user';
import UserError from '../../utils/UserError';
import { getUser, editUser } from '../../models/user';
import { events } from 'shared/analytics';
import { trackQueue, identifyQueue } from 'shared/bull/queues';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(
  async (_: any, args: EditUserInput, { user }: GraphQLContext) => {
    const track = () => {
      trackQueue.add({
        userId: user.id,
        event: events.USER_EDITED,
      });
      identifyQueue.add({ userId: user.id });
    };

    if (args.input.username) {
      if (
        args.input.username === 'null' ||
        args.input.username === 'undefined'
      ) {
        trackQueue.add({
          userId: user.id,
          event: events.USER_EDITED_FAILED,
          properties: {
            reason: 'bad username input',
          },
        });

        return new UserError('Nice try! 😉');
      }

      const dbUser = await getUser({ username: args.input.username });

      if (dbUser && dbUser.id !== user.id) {
        return new UserError(
          'Looks like that username got swooped! Try another?'
        );
      }
    }

    track();
    return editUser(args, user.id);
  }
);
