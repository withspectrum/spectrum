// @flow
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_YEAR = 31536000000;

export function timeDifferenceShort(current: number, previous: number) {
  const elapsed = current - previous;

  if (elapsed < MS_PER_MINUTE) {
    return Math.round(elapsed / MS_PER_SECOND) + 's';
  } else if (elapsed < MS_PER_HOUR) {
    return Math.round(elapsed / MS_PER_MINUTE) + 'm';
  } else if (elapsed < MS_PER_DAY) {
    return Math.round(elapsed / MS_PER_HOUR) + 'h';
  } else if (elapsed < MS_PER_YEAR) {
    return Math.round(elapsed / MS_PER_DAY) + 'd';
  } else {
    return Math.round(elapsed / MS_PER_YEAR) + 'y';
  }
}

export function timeDifference(current: number, previous: ?number): string {
  if (!previous) return '';

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
      return '1 minute ago';
    } else {
      return `${now} minutes ago`;
    }
  } else if (elapsed < msPerDay) {
    const now = Math.round(elapsed / msPerHour);
    if (now === 1) {
      return '1 hour ago';
    } else {
      return `${now} hours ago`;
    }
  } else if (elapsed < msPerMonth) {
    const now = Math.round(elapsed / msPerDay);
    if (now === 1) {
      return 'Yesterday';
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
      return '1 month ago';
    } else {
      return `${now} months ago`;
    }
  } else {
    const now = Math.round(elapsed / msPerYear);
    if (now === 1) {
      return '1 year ago';
    } else {
      return `${now} years ago`;
    }
  }
}
