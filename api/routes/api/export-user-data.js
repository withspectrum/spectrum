// @flow
import { Router } from 'express';
const userDataRouter = Router();
import { getUserById } from '../../models/user';
import { trackQueue } from 'shared/bull/queues';
import { events } from 'shared/analytics';

userDataRouter.get('/', async (req: express$Request, res: express$Response) => {
  if (!req.user) return res.send('No logged-in user');

  // $FlowIssue
  const user = await getUserById(req.user.id);
  if (!user) return res.send('User not found.');

  trackQueue.add({
    userId: user.id,
    event: events.USER_DOWNLOADED_PERSONAL_DATA,
  });

  // This forces the browser to download a .json file instead of rendering it
  res.setHeader('Content-Type', 'application/octet-stream');
  return res.send(user);
});

export default userDataRouter;
