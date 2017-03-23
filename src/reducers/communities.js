const initialState = {
  communities: [],
};

export default function communities(state = initialState, action) {
  switch (action.type) {
    case 'ADD_COMMUNITY':
      if (
        state.communities.find(
          community => community.id === action.community.id,
        )
      )
        return state;
      return {
        communities: state.communities.concat([action.community]),
      };
    case 'SET_COMMUNITIES':
      return {
        communities: action.communities,
      };
    default:
      return state;
  }
}
