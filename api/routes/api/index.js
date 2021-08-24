// @flow
import { Router } from 'express';

const apiRouter = Router();

// import graphiql from './graphiql';
// // Only allow GraphiQL in development
// if (process.env.NODE_ENV === 'development') {
//   apiRouter.use('/graphiql', graphiql);
// }

import userExportRouter from './export-user-data';
apiRouter.use('/user.json', userExportRouter);

// import graphql from './graphql';
// apiRouter.use('/', graphql);

export default apiRouter;
