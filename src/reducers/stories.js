const initialState = {
  stories: [],
  active: null,
  loaded: false,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'ADD_STORY':
      if (state.stories.find(story => story.id === action.story.id))
        return state;
      return Object.assign({}, state, {
        stories: state.stories.concat([action.story]),
      });
    case 'ADD_STORIES': {
      const stories = action.stories.filter(
        story =>
          !state.stories.find(storedStory => story.id === storedStory.id),
      );
      return Object.assign({}, state, {
        stories: state.stories.concat(stories),
        loaded: true,
      });
    }
    case 'CREATE_STORY':
      return Object.assign({}, state, {
        stories: state.stories.concat([action.story]),
        active: action.story.id,
      });
    case 'UPDATE_STORY':
      return Object.assign({}, state, {
        stories: state.stories.map(story => {
          if (story.id !== action.story.id) return story;

          return action.story;
        }),
      });
    case 'SET_ACTIVE_STORY':
      return Object.assign({}, state, {
        active: action.story,
      });
    case 'DELETE_STORY': {
      return Object.assign({}, state, {
        stories: state.stories.map(story => {
          if (story.id !== action.id) return story;

          return {
            ...story,
            deleted: true,
          };
        }),
      });
    }
    case 'TOGGLE_STORY_LOCK': {
      let stories = state.stories.slice().map(story => {
        if (story.id !== action.id) return story;

        return {
          ...story,
          locked: !action.locked,
        };
      });
      return Object.assign({}, state, { stories });
    }
    case 'CLEAR_ACTIVE_STORY':
      console.log('clearing');
      return Object.assign({}, state, {
        active: null,
      });
    case 'DELETE_FREQUENCY':
      return Object.assign({}, state, {
        stories: state.stories.filter(story => story.frequencyId !== action.id),
      });
    default:
      return state;
  }
}
