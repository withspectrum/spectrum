import { StyledButton, OutlineStyledButton, LinkStyledButton } from './style';

export const getSpinnerColor = (color: String, type: String): String => {
  // if it's a solid colored button, the spinner should be white
  if (type === 'button') {
    return 'text.reverse';
  }

  /*
    if the button is outline or link style, we need to generate a colored spinner
    based on either the color prop passed in, or the brand color if no color
    prop is detected
  */
  if (type === 'outline' || type === 'link') {
    switch (color) {
      case 'default': {
        return 'text.alt';
      }
      case 'brand': {
        return 'brand.default';
      }
      case 'pro': {
        return 'space.light';
      }
      case 'warn': {
        return 'warn.default';
      }
      case 'success': {
        return 'success.default';
      }
      default: {
        return 'brand.default';
      }
    }
  }
};

export const getButtonType = (type: String) => {
  // return a normal filled button by default
  if (!type) return StyledButton;

  // otherwise return the properly styled button
  if (type === 'outline') return OutlineStyledButton;
  if (type === 'link') return LinkStyledButton;
  if (type === 'icon') return LinkStyledButton;
};
