// eslint-disable-next-line
export const URLS = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gi;
export const FIGMA_URLS = /https:\/\/([w.-]+.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/gi;
export const YOUTUBE_URLS = /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/gi;
export const VIMEO_URLS = /\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/gi;
export const IFRAME_TAG = /(<iframe.*?src=['"](.*?)['"])/gi;
export const FRAMER_URLS = /(https?:\/\/(.+?\.)?framer\.cloud(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gi;
