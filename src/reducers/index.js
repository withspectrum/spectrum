import { combineReducers } from 'redux';
import user from './user';
import stories from './stories';
import frequencies from './frequencies';
import messages from './messages';
import composer from './composer';
import modals from './modals';
import gallery from './gallery';
import loading from './loading';
import notifications from './notifications';
import communities from './communities';
import ui from './ui';

export default combineReducers({
  user,
  stories,
  frequencies,
  communities,
  messages,
  composer,
  modals,
  gallery,
  loading,
  ui,
  notifications,
});
