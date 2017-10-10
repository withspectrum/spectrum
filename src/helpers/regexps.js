// Regex to match "~channel-slug" in text
// eslint-disable-next-line
export const CHANNELS = /(^|\s)(~[A-Z0-9\-]+)/gi;
// Regex to match ">spectrum.chat/~channel</a>"
// eslint-disable-next-line
export const CHANNEL_ANCHORS = />spectrum\.chat\/[A-Z0-9\-]+\/(~[A-Z0-9\-]+)<\/a>/gi;

// eslint-disable-next-line
export const URLS = /(^|\s)(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

// eslint-disable-next-line
export const IS_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
