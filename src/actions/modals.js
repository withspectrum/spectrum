// @flow
import { track } from '../helpers/events';

export const openModal = (name: string, props: Object) => {
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
