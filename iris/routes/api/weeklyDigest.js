// @flow
import { addQueue } from '../../utils/workerQueue';
// $FlowFixMe
import { Router } from 'express';

const weeklyDigestRouter = Router();

weeklyDigestRouter.get('/', (req, res) => {
  return addQueue('send weekly digest email', {});
});

export default weeklyDigestRouter;
