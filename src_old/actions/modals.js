import { track } from '../EventTracker';
/*------------------------------------------------------------\*
*

openModal
Takes a name and shows that modal. The name gets parsed in ModalRoot.js in order to determine which component to render

*
\*------------------------------------------------------------*/
export const openModal = (name, props) => {
  track(`modal ${name}`, 'opened', null);

  return {
    type: 'SHOW_MODAL',
    modalType: name,
    modalProps: props || {},
  };
};

export const closeModal = () => ({
  type: 'HIDE_MODAL',
});
