/* eslint no-useless-escape: 0 */
export const URLS = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&\/\/=]*)/gi;
export const FIGMA_URLS = /https:\/\/([w.-]+.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/gi;
export const YOUTUBE_URLS = /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/gi;
export const VIMEO_URLS = /\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/gi;
export const IFRAME_TAG = /(<iframe.*?src=['"](.*?)['"])/gi;
export const FRAMER_URLS = /(https?:\/\/(.+?\.)?framer\.cloud(\/[A-Za-z0-9\-._~:\/?#\[\]@!$&'()*+,;=]*)?)/gi;
export const ENDS_IN_WHITESPACE = /(\s|\n)$/;
export const TWITCH_URLS = /https?:\/\/www.twitch.tv\/(?!videos)(?!.*\/v\/)([a-zA-Z0-9_]+)/g;

export const MEDIA_PROVIDERS = [
  {
    name: 'Twitch Channel',
    regex:
      'https?://www.twitch.tv/(?!videos)(?!.*/v/)(?<CHANNEL>[a-zA-Z0-9_]+)',
    url: 'https://player.twitch.tv/?autoplay=false&channel={$CHANNEL}',
    replacements: ['CHANNEL'],
    aspectRatio: '56.25%',
  },
  {
    name: 'Twitch Clips',
    regex:
      'https?:\\/\\/clips.twitch.tv\\/(?<AUTHOR>([a-zA-Z0-9_]+)\\/)?(?<VIDEO>[a-zA-Z0-9_]+)',
    url: 'https://clips.twitch.tv/embed?clip={$AUTHOR}{$VIDEO}&autoplay=false',
    replacements: ['AUTHOR', 'VIDEO'],
    aspectRatio: '56.25%',
  },
  {
    name: 'Spotify Playlist',
    regex: [
      'https?:\\/\\/(?:open|play).spotify.com\\/user\\/spotify\\/playlist\\/(?<ID>[0-9a-zA-Z]+)',
    ],
    url: 'https://embed.spotify.com/?uri=spotify:user:spotify:playlist:{$ID}',
    replacements: ['ID'],
    height: 280,
  },
  {
    name: 'Spotify Track',
    regex:
      'https?:\\/\\/(?:open|play).spotify.com\\/track\\/(?<ID>[0-9a-zA-Z]+)',
    url: 'https://embed.spotify.com/?uri=spotify:track:{$ID}',
    replacements: ['ID'],
    height: 80,
  },
  {
    name: 'Spotify',
    regex:
      'https?:\\/\\/(?:open|play).spotify.com\\/(?<TYPE>[a-zA-Z]+)\\/(?<ID>[0-9a-zA-Z]+)',
    url: 'https://embed.spotify.com/?uri=spotify:{$TYPE}:{$ID}',
    replacements: ['TYPE', 'ID'],
    height: 280,
  },
  {
    name: 'gfycat',
    regex: 'https?://gfycat\\.com/(?<ID>[a-zA-Z0-9]+)',
    url: 'https://gfycat.com/ifr/{$ID}',
    replacements: ['ID'],
    aspectRatio: '56.25%',
  },
];
