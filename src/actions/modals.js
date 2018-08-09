// @flow
import type { ModalTypes } from 'src/components/modals/modalRoot';

export const openModal = (name: ModalTypes, props?: Object) => {
  return {
    type: 'SHOW_MODAL',
    modalType: name,
    modalProps: props || {},
  };
};

export const closeModal = () => ({
  type: 'HIDE_MODAL',
});
