const initialState = {
  isOpen: false,
  threadId: null,
  messageId: null,
};

export default function gallery(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_GALLERY':
      return {
        isOpen: true,
        threadId: action.threadId,
        messageId: action.messageId,
      };
    case 'HIDE_GALLERY':
      return { initialState };
    default:
      return state;
  }
}
