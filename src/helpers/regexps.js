// Regex to match "~frequency-slug" in text
export const FREQUENCIES = /(^|\s)(~[A-Z0-9\-]+)/gi;
// Regex to match ">spectrum.chat/~frequency</a>"
export const FREQUENCY_ANCHORS = />spectrum\.chat\/(~[A-Z0-9\-]+)<\/a>/gi;
