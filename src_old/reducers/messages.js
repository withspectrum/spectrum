const initialState = {
  messages: [],
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'ADD_MESSAGES': {
      // Make sure local messages are overriden if they aren't persisted yet
      const storedMessages = state.messages.map(message => {
        const serverMessage = action.messages.find(
          newMessage =>
            newMessage.id === message.id && message.persisted === false
        );
        return serverMessage || message;
      });
      const messages = action.messages.filter(
        message =>
          !storedMessages.find(storedMessage => message.id === storedMessage.id)
      );

      return Object.assign({}, state, {
        messages: storedMessages.concat(messages),
      });
    }
    case 'ADD_REACTION': {
      return {
        ...state,
        messages: state.messages.map(message => {
          if (message.id !== action.messageId) return message;
          return {
            ...message,
            reactions: {
              ...message.reactions,
              [action.uid]: {
                timestamp: Date.now(),
                type: 'like',
              },
            },
          };
        }),
      };
    }
    case 'REMOVE_REACTION': {
      return {
        ...state,
        messages: state.messages.map(message => {
          if (message.id !== action.messageId) return message;

          const reactions = Object.assign({}, message.reactions);
          delete reactions[action.uid];

          return {
            ...message,
            reactions,
          };
        }),
      };
    }
    case 'SEND_MESSAGE': {
      return {
        ...state,
        messages: state.messages.concat([action.message]),
      };
    }
    case 'SET_ALL_MESSAGES':
      return Object.assign({}, state, {
        messages: action.messages,
      });
    case 'CLEAR_MESSAGES':
      return initialState;
    default:
      return state;
  }
}
