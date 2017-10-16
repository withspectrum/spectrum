import React from 'react';
// NOTE (@mxstbr): The /dist here is a bug in a specific version of emoji-regex
// Can be removed after the next release: https://github.com/mathiasbynens/emoji-regex/pull/12
// $FlowFixMe
import createEmojiRegex from 'emoji-regex';

import replace from 'string-replace-to-array';

export const convertTimestampToDate = (timestamp: Date) => {
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

// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();
// Make sure we match strings that only contain emojis (and whitespace)
const regex = new RegExp(
  `^(${originalEmojiRegex.toString().replace(/\/g$/, '')}|\\s)+$`
);
export const onlyContainsEmoji = (text: string) => regex.test(text);

export const draftOnlyContainsEmoji = (raw: object) =>
  raw.blocks.length === 1 &&
  raw.blocks[0].type === 'unstyled' &&
  onlyContainsEmoji(raw.blocks[0].text);
/**
 * Encode a string to base64 (using the Node built-in Buffer)
 *
 * Stolen from http://stackoverflow.com/a/38237610/2115623
 */
export const encode = (string: string) =>
  Buffer.from(string).toString('base64');

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

export function timeDifference(current: Date, previous: Date) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return 'Just now';
  } else if (elapsed < msPerHour) {
    const now = Math.round(elapsed / msPerMinute);
    if (now === 1) {
      return `1 minute ago`;
    } else {
      return `${now} minutes ago`;
    }
  } else if (elapsed < msPerDay) {
    const now = Math.round(elapsed / msPerHour);
    if (now === 1) {
      return `1 hour ago`;
    } else {
      return `${now} hours ago`;
    }
  } else if (elapsed < msPerMonth) {
    const now = Math.round(elapsed / msPerDay);
    if (now === 1) {
      return `Yesterday`;
    } else if (now >= 7 && now <= 13) {
      return '1 week ago';
    } else if (now >= 14 && now <= 20) {
      return '2 weeks ago';
    } else if (now >= 21 && now <= 28) {
      return '3 weeks ago';
    } else {
      return `${now} days ago`;
    }
  } else if (elapsed < msPerYear) {
    const now = Math.round(elapsed / msPerMonth);
    if (now === 1) {
      return `1 month ago`;
    } else {
      return `${now} months ago`;
    }
  } else {
    const now = Math.round(elapsed / msPerYear);
    if (now === 1) {
      return `1 year ago`;
    } else {
      return `${now} years ago`;
    }
  }
}

export function timeDifferenceShort(current: Date, previous: Date) {
  const msPerSecond = 1000;
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const now = Math.round(elapsed / msPerSecond);
    return `${now}s`;
  } else if (elapsed < msPerHour) {
    const now = Math.round(elapsed / msPerMinute);
    return `${now}m`;
  } else if (elapsed < msPerDay) {
    const now = Math.round(elapsed / msPerHour);
    return `${now}h`;
  } else if (elapsed < msPerYear) {
    const now = Math.round(elapsed / msPerDay);
    return `${now}d`;
  } else {
    const now = Math.round(elapsed / msPerYear);
    return `${now}y`;
  }
}

export const debounce = (func, wait, immediate) => {
  let timeout;
  return () => {
    let context = this,
      args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const throttle = (func, threshhold, scope) => {
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

export const getLinkPreviewFromUrl = url =>
  fetch(`https://links.spectrum.chat/?url=${url}`).then(response => {
    return response.json();
  });

// Truncate a string nicely to a certain length
export const truncate = (str, length) => {
  if (str.length <= length) {
    return str;
  }
  const subString = str.substr(0, length);
  return subString.substr(0, subString.lastIndexOf(' ')) + '…';
};

// takes a number like 1,480 and returns a truncated number: 1.5k
// takes an option 'places' argument to round - default to 1 (e.g. 1 = 1.5k. 2 = 1.48k)
export const truncateNumber = (number: number, places = 1) => {
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

export const hasProtocol = url => {
  const PROTOCOL = /(http(s?)):\/\//gi;
  const hasProtocol = url.match(PROTOCOL);
  if (hasProtocol) {
    return true;
  }
  return false;
};

export const addProtocolToString = string => {
  // if the string starts with http or https, we are good
  if (hasProtocol(string)) {
    return string;
  } else {
    // otherwise it doesn't start with a protocol, prepend http
    return `http://${string}`;
  }
};

export const sortByDate = (array, key, order) => {
  return array.sort((a, b) => {
    const x = new Date(a[key]).getTime();
    const y = new Date(b[key]).getTime();
    // desc = older to newest from top to bottom
    const val = order === 'desc' ? y - x : x - y;
    return val;
  });
};

export const renderMarkdownLinks = text => {
  const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

  return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
    <a href={url} target="_blank" rel="noopener nofollower">
      {text}
    </a>
  ));
};

const URL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;

export const renderLinks = text => {
  if (typeof text !== 'string') return text;
  return replace(text, URL, url => (
    <a href={url} target="_blank" rel="noopener nofollower">
      {url}
    </a>
  ));
};
