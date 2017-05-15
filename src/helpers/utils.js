// @flow

// NOTE (@mxstbr): The /dist here is a bug in a specific version of emoji-regex
// Can be removed after the next release: https://github.com/mathiasbynens/emoji-regex/pull/12
// $FlowFixMe
import createEmojiRegex from 'emoji-regex';

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

export function timeDifference(current, previous) {
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
      return 'A week ago';
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
      return `A month ago`;
    } else {
      return `${now} months ago`;
    }
  } else {
    const now = Math.round(elapsed / msPerYear);
    if (now === 1) {
      return `A year ago`;
    } else {
      return `${now} years ago`;
    }
  }
}
