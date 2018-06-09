// @flow

export const getToastColorFromType = (type: string, theme: Object) => {
  switch (type) {
    case 'success': {
      return theme.success.default;
    }
    case 'notification': {
      return theme.brand.alt;
    }
    case 'error': {
      return theme.warn.default;
    }
    case 'neutral':
    default: {
      return theme.text.alt;
    }
  }
};
