// Regex to match "~channel-slug" in text
export const CHANNELS = /(^|\s)(~[A-Z0-9\-]+)/gi;
// Regex to match ">spectrum.chat/~channel</a>"
export const CHANNEL_ANCHORS = />spectrum\.chat\/[A-Z0-9\-]+\/(~[A-Z0-9\-]+)<\/a>/gi;
