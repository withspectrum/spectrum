const initialState = {
  errors: [],
};

export default function errors(state = initialState, action) {
  switch (action.type) {
    case 'THROW_ERROR':
      return {
        errors: state.errors.concat(action.err),
      };
    default:
      return state;
  }
}
