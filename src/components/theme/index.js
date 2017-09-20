// export our theme to the provider
// This is globally available in styled-components when interpolating a function like so:
// ${(props) => props.theme}
// Or using import { withTheme } from 'styled-components';

export const theme = {
  bg: {
    default: '#FFFFFF',
    reverse: '#16171A',
    wash: '#F5F8FC',
    border: '#DFE7EF',
    inactive: '#DFE7EF',
  },
  brand: {
    default: '#4400CC',
    alt: '#7B16FF',
    wash: '#E8E5FF',
    border: '#DDD9FF',
  },
  generic: {
    default: '#E6ECF7',
    alt: '#F6FBFC',
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
    google: {
      default: '#ea4335',
      alt: '#ea4335',
    },
    github: {
      default: '#1475DA',
      alt: '#1475DA',
    },
  },
  space: {
    default: '#0062D6',
    alt: '#1CD2F2',
    wash: '#E5F0FF',
    border: '#BDD8FF',
    dark: '#0F015E',
  },
  special: {
    default: '#E58306',
    alt: '#F1C742',
    dark: '#7D4A00',
    wash: '#FFF5E5',
    border: '#FFE6BF',
  },
  success: {
    default: '#00B88B',
    alt: '#00D5BD',
    dark: '#00663C',
    wash: '#D9FFF2',
    border: '#9FF5D9',
  },
  text: {
    default: '#16171A',
    alt: '#828C99',
    reverse: '#FFFFFF',
    placeholder: '#A3AFBF',
  },
  warn: {
    default: '#C21F3A',
    alt: '#E2197A',
    dark: '#85000C',
    wash: '#FFEDF6',
    border: '#FFCCE5',
  },
};
