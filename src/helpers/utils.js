// @flow
import React from 'react';
import replace from 'string-replace-to-array';

export const convertTimestampToDate = (timestamp: number) => {
  let monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let date = new Date(timestamp);
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let month = monthNames[monthIndex];
  let year = date.getFullYear();
  let hours = date.getHours() || 0;
  let cleanHours;
  if (hours === 0) {
    cleanHours = 12; // if timestamp is between midnight and 1am, show 12:XX am
  } else {
    cleanHours = hours > 12 ? hours - 12 : hours; // else show proper am/pm -- todo: support 24hr time
  }
  let minutes = date.getMinutes();
  minutes = minutes >= 10 ? minutes : '0' + minutes.toString(); // turns 4 minutes into 04 minutes
  let ampm = hours >= 12 ? 'pm' : 'am'; // todo: support 24hr time
  return `${month} ${day}, ${year} · ${cleanHours}:${minutes}${ampm}`;
};

export const convertTimestampToTime = (timestamp: Date) => {
  let date = new Date(timestamp);
  let hours = date.getHours() || 0;
  let cleanHours;
  if (hours === 0) {
    cleanHours = 12; // if timestamp is between midnight and 1am, show 12:XX am
  } else {
    cleanHours = hours > 12 ? hours - 12 : hours; // else show proper am/pm -- todo: support 24hr time
  }
  let minutes = date.getMinutes();
  minutes = minutes >= 10 ? minutes : '0' + minutes.toString(); // turns 4 minutes into 04 minutes
  let ampm = hours >= 12 ? 'pm' : 'am'; // todo: support 24hr time
  return `${cleanHours}:${minutes}${ampm}`;
};

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

export const throttle = (func: Function, threshhold: number, scope: any) => {
  threshhold || (threshhold = 250);
  let last, deferTimer;
  return function() {
    let context = scope || this;

    let now = +new Date(),
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        func.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      func.apply(context, args);
    }
  };
};

export const getLinkPreviewFromUrl = (url: string) =>
  fetch(`https://links.spectrum.chat/?url=${url}`)
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.error('Error getting link preview: ', err);
    });

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
    <a href={url} target="_blank" rel="noopener nofollower">
      {text}
    </a>
  ));
};

export const getTruthyValuesFromObject = (object: Object): Array<?string> => {
  return Object.keys(object).filter(key => object[key] === true);
};
