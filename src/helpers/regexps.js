// eslint-disable-next-line
export const URLS = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gi;
// eslint-disable-next-line
export const FIGMA_URLS = /https:\/\/([w.-]+.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/gi;
// eslint-disable-next-line
export const YOUTUBE_URLS = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/gi;
// eslint-disable-next-line
export const VIMEO_URLS = /\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/gi;
// eslint-disable-next-line
export const IFRAME_TAG = /(<iframe.*?src=['"](.*?)['"])/gi;
// eslint-disable-next-line
export const FRAMER_URLS = /(https?:\/\/(.+?\.)?framer\.cloud(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gi;
// eslint-disable-next-line
export const CODEPEN_URLS = /(https?:\/\/)?(.+?\.)?codepen\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
// eslint-disable-next-line
export const CODESANDBOX_URLS = /(https?:\/\/)?(.+?\.)?codesandbox\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
// eslint-disable-next-line
export const ENDS_IN_WHITESPACE = /(\s|\n)$/;
