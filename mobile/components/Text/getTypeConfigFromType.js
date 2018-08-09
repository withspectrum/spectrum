// @flow
import type { TextTypes } from './';

export default (type: TextTypes) => {
  const defaultConfig = {
    size: 17,
    leading: 22,
  };

  switch (type) {
    case 'largeTitle': {
      return {
        size: 36,
        leading: 41,
      };
    }
    case 'title1': {
      return {
        size: 32,
        leading: 34,
      };
    }
    case 'title2': {
      return {
        size: 24,
        leading: 28,
      };
    }
    case 'title3': {
      return {
        size: 20,
        leading: 25,
      };
    }
    case 'headline': {
      return {
        size: 18,
        leading: 22,
      };
    }
    case 'body': {
      return {
        size: 16,
        leading: 22,
      };
    }
    case 'callout': {
      return {
        size: 15,
        leading: 21,
      };
    }
    case 'subhead': {
      return {
        size: 14,
        leading: 20,
      };
    }
    case 'footnote': {
      return {
        size: 13,
        leading: 18,
      };
    }
    case 'caption1': {
      return {
        size: 12,
        leading: 16,
      };
    }
    case 'caption2': {
      return {
        size: 11,
        leading: 13,
      };
    }
    default: {
      return defaultConfig;
    }
  }
};
