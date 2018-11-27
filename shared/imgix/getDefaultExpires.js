// @flow

/*
Expire images sent to the client at midnight each day (UTC).
Expiration needs to be consistent across all images in order
to preserve client-side caching abilities and to prevent checksum
mismatches during SSR
*/

export const getDefaultExpires = () => {
  const date = new Date();
  date.setHours(24);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
};
