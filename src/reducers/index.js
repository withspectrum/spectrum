import { combineReducers } from 'redux';
import user from './user';
import stories from './stories';
import frequencies from './frequencies';
import messages from './messages';
import composer from './composer';
import messageComposer from './messageComposer';
import modals from './modals';
import gallery from './gallery';
import loading from './loading';
import notifications from './notifications';
import communities from './communities';
import errors from './errors';
import ui from './ui';
import messageGroups from './messageGroups';

export default combineReducers({
  user,
  stories,
  frequencies,
  communities,
  messages,
  composer,
  messageComposer,
  modals,
  gallery,
  loading,
  ui,
  notifications,
  messageGroups,
  errors,
});
