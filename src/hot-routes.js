// @flow
// This takes the ./routes.js file and makes it hot reload.
// This should only be used on the client, not on the server!
import { hot } from 'react-hot-loader';
import Routes from './routes';

export default hot(module)(Routes);
