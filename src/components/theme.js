// export our theme to the provider
// This is globally available in styled-components when interpolating a function like so:
// ${(props) => props.theme}
// Or using import { withTheme } from 'styled-components';
export const theme = {
  brand: {
    default: '#3818E5',
    alt: '#7B16FF',
  },
  space: {
    dark: '#0F015E',
    light: '#1CD2F2',
    soft: '#ACC7FF',
  },
  pro: {
    default: '#1CD2F2',
    alt: '#00D6A9',
  },
  warn: {
    default: '#E3353C',
    alt: '#E2197A',
  },
  success: {
    default: '#00C383',
    alt: '#00D6A9',
  },
  bg: {
    default: '#FFFFFF',
    reverse: '#171A21',
    wash: '#F2F5F9',
  },
  text: {
    default: '#171A21',
    alt: '#747E8D',
    reverse: '#FFFFFF',
    placeholder: '#B2B9C6',
  },
  generic: {
    default: '#E6ECF7',
    alt: '#F6FBFF',
  },
  inactive: '#D6E0EE',
  border: {
    default: '#DFE7EF',
  },
  social: {
    facebook: {
      default: '#3B5998',
      alt: '#5A85DF',
    },
    twitter: {
      default: '#00ACED',
      alt: '#53D0FF',
    },
  },
};
