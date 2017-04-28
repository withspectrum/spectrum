const initialState = {
  modalType: null,
  modalProps: {},
  isOpen: false,
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        modalType: action.modalType,
        modalProps: action.modalProps,
        isOpen: true,
      };
    case 'DELETE_FREQUENCY':
    case 'CREATE_FREQUENCY':
    case 'EDIT_FREQUENCY':
    case 'HIDE_MODAL':
    case 'UPGRADE_USER':
      return initialState;
    default:
      return state;
  }
}
