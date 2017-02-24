const initialState = {
  navVisible: false
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_NAV':
      return {
        navVisible: true
      };
    case 'TOGGLE_NAV':
      return {
        navVisible: !state.navVisible
      };
    case 'HIDE_NAV':
      return {
        navVisible: false
      }    
    default:
      return state;
  }
}
