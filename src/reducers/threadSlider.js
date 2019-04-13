const initialState = {
  isOpen: false,
  threadId: null,
};

export default function threadSlider(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_SLIDER':
      return {
        isOpen: true,
        threadId: action.threadId,
      };
    case 'CLOSE_SLIDER':
      return {
        isOpen: false,
        threadId: null,
      };
    default:
      return state;
  }
}
