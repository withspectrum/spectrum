const initialState = {
  isOpen: false,
  title: '',
  body: '',
  newStoryKey: null,
  mediaList: [],
  metadata: null,
  error: null,
  editing: false,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_COMPOSER_OPEN':
      if (state.editing) {
        // if the user was editing a post, when the close the composer clear the edit
        return Object.assign({}, state, {
          title: '',
          body: '',
          newStoryKey: null,
          isOpen: false,
          mediaList: [],
          error: null,
          metadata: null,
          editing: false,
        });
      } else {
        // otherwise we preserve the composer content in case the user comes back to it
        return Object.assign({}, state, {
          isOpen: !state.isOpen,
        });
      }
    case 'CLOSE_COMPOSER':
      return Object.assign({}, state, {
        isOpen: false,
        editing: false,
      });
    case 'CREATE_DRAFT':
      return Object.assign({}, state, {
        newStoryKey: action.key,
      });
    case 'INIT_EDIT_STORY':
      // if the edited story has photos in its metadata, set the mediaList so that they can be removed
      const mediaList = action.story.metadata && action.story.metadata.photos
        ? action.story.metadata.photos
        : [];
      return Object.assign({}, state, {
        isOpen: true,
        title: action.story.content.title,
        body: action.story.content.description,
        newStoryKey: action.story.id,
        metadata: action.story.metadata,
        mediaList,
        editing: true,
      });
    case 'EDIT_STORY':
    case 'CANCEL_EDIT_STORY':
    case 'CREATE_STORY':
      return Object.assign({}, state, {
        title: '',
        body: '',
        newStoryKey: null,
        isOpen: false,
        mediaList: [],
        error: null,
        metadata: null,
        editing: false,
      });
    case 'SET_ACTIVE_STORY':
    case 'SET_ACTIVE_FREQUENCY':
      return Object.assign({}, state, {
        isOpen: false,
      });
    case 'UPDATE_TITLE':
      return Object.assign({}, state, {
        title: action.title,
      });
    case 'UPDATE_BODY':
      return Object.assign({}, state, {
        body: action.body,
      });
    case 'ADD_LINK_PREVIEW':
      return Object.assign({}, state, {
        metadata: {
          ...state.metadata,
          linkPreview: {
            data: action.linkPreview.data,
            trueUrl: action.linkPreview.trueUrl,
          },
        },
      });
    case 'REMOVE_LINK_PREVIEW':
      return Object.assign({}, state, {
        metadata: {
          ...state.metadata,
          linkPreview: null,
        },
      });
    case 'SET_COMPOSER_ERROR':
      return Object.assign({}, state, {
        error: action.error,
      });
    case 'ADD_MEDIA_LIST':
      return Object.assign({}, state, {
        mediaList: state.mediaList.concat(action.file),
        metadata: {
          ...state.metadata,
          photos: state.mediaList.concat(action.file),
        },
      });
    case 'REMOVE_MEDIA_LIST': {
      const mediaList = state.mediaList
        .slice()
        .filter(file => file.meta.key !== action.image);
      const photos = state.metadata.photos
        .slice()
        .filter(file => file.meta.key !== action.image);
      return Object.assign({}, state, {
        ...state,
        mediaList,
        metadata: {
          ...state.metadata,
          photos,
        },
      });
    }
    default:
      return state;
  }
}
