// @flow
export const openModal = (name: string, props: Object) => {
  return {
    type: 'SHOW_MODAL',
    modalType: name,
    modalProps: props || {},
  };
};

export const closeModal = () => ({
  type: 'HIDE_MODAL',
});
