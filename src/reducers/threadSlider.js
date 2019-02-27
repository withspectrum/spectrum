const initialState = {
  isOpen: false,
};

export default function threadSlider(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_SLIDER':
      return {
        isOpen: true,
      };
    case 'CLOSE_SLIDER':
      return {
        isOpen: false,
      };
    default:
      return state;
  }
}
