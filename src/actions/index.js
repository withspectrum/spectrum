import userActions from './user';
import storyActions from './stories';
import messageActions from './messages';
import frequencyActions from './frequencies';
import composerActions from './composer';
import modalActions from './modals';
import galleryActions from './gallery';

export default Object.assign(
  {},
  userActions,
  storyActions,
  messageActions,
  frequencyActions,
  composerActions,
  modalActions,
  galleryActions,
);
