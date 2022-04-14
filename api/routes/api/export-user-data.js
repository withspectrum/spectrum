// @flow
import { Router } from 'express';
const userDataRouter = Router();
import { getUserById } from 'shared/db/queries/user';

userDataRouter.get('/', async (req: express$Request, res: express$Response) => {
  if (!req.user) return res.send('No logged-in user');

  // $FlowIssue
  const user = await getUserById(req.user.id);
  if (!user) return res.send('User not found.');

  // This forces the browser to download a .json file instead of rendering it
  res.setHeader('Content-Type', 'application/octet-stream');
  return res.send(user);
});

export default userDataRouter;
