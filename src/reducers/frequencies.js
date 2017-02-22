const initialState = {
  frequencies: [],
  active: null,
  loaded: false,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FREQUENCY':
      return Object.assign({}, state, {
        frequencies: state.frequencies.concat([action.frequency]),
        active: action.frequency.id,
      });
    case 'EDIT_FREQUENCY': {
      let frequencies = state.frequencies.slice().map(frequency => {
        if (frequency.id !== action.frequency.id) return frequency;
        return {
          ...frequency,
          name: action.frequency.name,
          slug: action.frequency.slug,
          settings: {
            private: action.frequency.settings.private,
            tint: action.frequency.settings.tint,
          },
        };
      });
      return Object.assign({}, state, { frequencies });
    }
    case 'DELETE_FREQUENCY': {
      let frequencies = state.frequencies
        .slice()
        .filter(frequency => frequency.id !== action.id);
      return Object.assign({}, state, { frequencies });
    }
    case 'SET_FREQUENCIES':
      return Object.assign({}, state, {
        frequencies: action.frequencies,
        loaded: true,
      });
    case 'SET_INITIAL_DATA':
    case 'SET_ACTIVE_FREQUENCY':
      return Object.assign({}, state, {
        active: action.frequency,
      });
    default:
      return state;
  }
}
