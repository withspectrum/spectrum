import { groupFrequencies } from '../helpers/frequencies';

const initialState = {
  frequencies: [],
  byCommunity: {},
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
        byCommunity: groupFrequencies(
          state.frequencies.concat([action.frequency])
        ),
      });
    case 'SUBSCRIBE_FREQUENCY': {
      let frequencies;
      // If we have the frequency in the state, update it
      if (state.frequencies.find(freq => freq.id === action.frequency.id)) {
        frequencies = state.frequencies.map(freq => {
          if (freq.id !== action.frequency.id) return freq;

          return action.frequency;
        });
      } else {
        frequencies = state.frequencies.concat([action.frequency]);
      }
      return Object.assign({}, state, {
        frequencies,
        byCommunity: groupFrequencies(frequencies),
      });
    }
    case 'CREATE_FREQUENCY': {
      const frequencies = state.frequencies.concat([action.frequency]);
      return Object.assign({}, state, {
        frequencies,
        byCommunity: groupFrequencies(frequencies),
        active: action.frequency.slug,
      });
    }
    case 'EDIT_FREQUENCY': {
      const frequencies = state.frequencies.slice().map(frequency => {
        if (frequency.id !== action.frequency.id) return frequency;
        return {
          ...frequency,
          ...action.frequency,
        };
      });
      return Object.assign({}, state, {
        frequencies,
        byCommunity: groupFrequencies(frequencies),
      });
    }
    case 'DELETE_FREQUENCY': {
      const frequencies = state.frequencies
        .slice()
        .filter(frequency => frequency.id !== action.id);
      return Object.assign({}, state, {
        frequencies,
        byCommunity: groupFrequencies(frequencies),
        active: 'hugs-n-bugs',
      });
    }
    case 'SET_FREQUENCIES': {
      const frequencies = state.frequencies
        .filter(frequency =>
          action.frequencies.every(freq => freq.id !== frequency.id)
        )
        .concat(action.frequencies);
      return Object.assign({}, state, {
        frequencies: frequencies,
        byCommunity: groupFrequencies(frequencies),
        loaded: true,
      });
    }
    case 'SET_ACTIVE_FREQUENCY':
      return Object.assign({}, state, {
        active: action.frequency,
      });
    case 'FREQUENCIES_LOADED':
      return Object.assign({}, state, {
        loaded: true,
      });
    case 'UNSUBSCRIBE_FREQUENCY': {
      const frequencies = state.frequencies.map(frequency => {
        if (frequency.id !== action.id) return frequency;

        delete frequency.users[action.uid];

        return {
          ...frequency,
          users: frequency.users,
        };
      });
      return {
        ...state,
        frequencies,
        byCommunity: groupFrequencies(frequencies),
      };
    }
    default:
      return state;
  }
}
