// @flow
import React from 'react';
import replace from 'string-replace-to-array';

/*
  Best guess at if user is on a mobile device. Used in the modal components
  to determine where the modal should be positioned, how it should close and
  scroll, etc
*/
export function isMobile() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (
    /windows phone/i.test(userAgent) ||
    /android/i.test(userAgent) ||
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
  ) {
    return true;
  }

  return false;
}

export const debounce = (func: Function, wait: number, immediate: boolean) => {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    // $FlowFixMe
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const throttle = (func: Function, threshold: number, scope: any) => {
  threshold || (threshold = 250);
  let last, deferTimer;
  return function() {
    let context = scope || this;

    let now = +new Date(),
      args = arguments;
    if (last && now < last + threshold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        func.apply(context, args);
      }, threshold);
    } else {
      last = now;
      func.apply(context, args);
    }
  };
};

// Truncate a string nicely to a certain length
export const truncate = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }
  const subString = str.substr(0, length);
  return subString.substr(0, subString.lastIndexOf(' ')) + '…';
};

// takes a number like 1,480 and returns a truncated number: 1.5k
// takes an option 'places' argument to round - default to 1 (e.g. 1 = 1.5k. 2 = 1.48k)
export const truncateNumber = (number: number, places: number = 1) => {
  const truncated =
    number > 999 ? (number / 1000).toFixed(places) + 'k' : number;
  // if the last number is 0 and we are rounding to one place, just ommit
  const lastDigit = truncated.toString().slice(-2);

  if (lastDigit === '0k' && places === 1) {
    return truncated.toString().slice(0, -3) + 'k';
  } else {
    return truncated;
  }
};

export const sortByDate = (array: Array<any>, key: string, order: string) => {
  return array.sort((a, b) => {
    const x = new Date(a[key]).getTime();
    const y = new Date(b[key]).getTime();
    // desc = older to newest from top to bottom
    const val = order === 'desc' ? y - x : x - y;
    return val;
  });
};

export const sortByTitle = (array: Array<any>) => {
  return array.sort((a, b) => {
    const x = a['name'];
    const y = b['name'];
    const val = x.localeCompare(y, {
      sensitivity: 'base',
      numeric: 'true',
      caseFirst: 'upper',
    });
    return val;
  });
};

export const renderMarkdownLinks = (text: string) => {
  const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

  return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  ));
};
