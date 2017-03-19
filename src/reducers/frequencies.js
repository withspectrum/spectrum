const initialState = {
  frequencies: [],
  active: null,
  loaded: false,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FREQUENCY':
      if (state.frequencies.find(freq => freq.id === action.frequency.id))
        return state;
      return Object.assign({}, state, {
        frequencies: state.frequencies.concat([action.frequency]),
      });
    case 'SUBSCRIBE_FREQUENCY':
      // If we have the frequency in the state, update it
      if (state.frequencies.find(freq => freq.id === action.frequency.id)) {
        return {
          ...state,
          frequencies: state.frequencies.map(freq => {
            if (freq.id !== action.frequency.id) return freq;

            return action.frequency;
          }),
        };
      }
      return Object.assign({}, state, {
        frequencies: state.frequencies.concat([action.frequency]),
      });
    // Otherwise just add it at the end
    case 'CREATE_FREQUENCY':
      return Object.assign({}, state, {
        frequencies: state.frequencies.concat([action.frequency]),
        active: action.frequency.slug,
      });
    case 'EDIT_FREQUENCY': {
      let frequencies = state.frequencies.slice().map(frequency => {
        if (frequency.id !== action.frequency.id) return frequency;
        return {
          ...frequency,
          name: action.frequency.name,
          slug: action.frequency.slug,
          description: action.frequency.description,
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
      return Object.assign({}, state, {
        frequencies,
        active: 'hugs-n-bugs',
      });
    }
    case 'SET_FREQUENCIES':
      return Object.assign({}, state, {
        frequencies: action.frequencies,
        loaded: true,
      });
    case 'SET_ACTIVE_FREQUENCY':
      return Object.assign({}, state, {
        active: action.frequency,
      });
    case 'FREQUENCIES_LOADED':
      return Object.assign({}, state, {
        loaded: true,
      });
    case 'UNSUBSCRIBE_FREQUENCY': {
      return {
        ...state,
        frequencies: state.frequencies.map(frequency => {
          if (frequency.id !== action.id) return frequency;

          delete frequency.users[action.uid];

          return {
            ...frequency,
            users: frequency.users,
          };
        }),
      };
    }
    default:
      return state;
  }
}
