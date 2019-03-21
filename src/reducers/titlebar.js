// @flow
const initialState = {
  title: '',
  titleIcon: null,
  rightAction: null,
  leftAction: 'menu',
};

export default function titlebar(
  state: typeof initialState = initialState,
  action: Object
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_TITLEBAR_PROPS': {
      return Object.assign({}, state, {
        title: payload.title && payload.title,
        titleIcon: payload.titleIcon && payload.titleIcon,
        rightAction: payload.rightAction && payload.rightAction,
        leftAction: payload.leftAction || 'menu',
      });
    }
    default:
      return state;
  }
}
