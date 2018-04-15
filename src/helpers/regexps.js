// @flow
/* eslint no-useless-escape: 0 */
import querystring from 'querystring';
export const URLS = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&\/\/=]*)/gi;
export const FIGMA_URLS = /https:\/\/([w.-]+.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/gi;
export const IFRAME_TAG = /(<iframe.*?src=['"](.*?)['"])/gi;
export const ENDS_IN_WHITESPACE = /(\s|\n)$/;

export interface MediaProvider {
  name: string;
  regex: string;
  url: string | ((url: string) => string);
  query?: string | ((url: string) => string);
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export const MEDIA_PROVIDERS = [
  {
    name: 'YouTube',
    regex:
      '(?:[?&]v=|\\/embed\\/|\\/1\\/|\\/v\\/|https:\\/\\/(?:www\\.)?youtu\\.be\\/)(?<ID>[^&\\n?#]+)',
    url: 'https://www.youtube.com/embed/{$ID}',
    aspectRatio: '56.25%',
    query: (url: string) => {
      const parsedUrl = new URL(url);
      const urlQuery = querystring.parse(parsedUrl.search);
      const hasTimestamp = Object.prototype.hasOwnProperty.call(urlQuery, 't');
      const query = hasTimestamp
        ? { start: getSecondsFromTimestamp(urlQuery.t) }
        : {};
      return querystring.stringify(query);

      function getSecondsFromTimestamp(timestamp: string): number {
        const regExp = new RegExp(
          '(?:(?<HOURS>[0-9]+)h)?(?:(?<MINUTES>[0-9]+)m)?(?<SECONDS>[0-9]+)s'
        );
        return parseInt(
          timestamp.replace(regExp, (_, _1, _2, _3, _4, _5, values) => {
            const hours = parseInt(values.HOURS || 0, 10);
            const minutes = parseInt(values.MINUTES || 0, 10);
            const seconds = parseInt(values.SECONDS || 0, 10);
            return String(
              parseInt(hours * 60 * 60 + minutes * 60 + seconds, 10)
            );
          }),
          10
        );
      }
    },
  },
  {
    name: 'Vimeo',
    regex:
      '\\/\\/(www\\.)?vimeo.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|)(?<ID>\\d+)(?:|\\/\\?)',
    url: 'https://player.vimeo.com/video/{$ID}',
    aspectRatio: '56.25%',
  },
  {
    name: 'Figma',
    regex:
      "(https?:\\/\\/(.+?\\.)?framer\\.cloud\\/([A-Za-z0-9\\-._~:\\/?#\\[\\]@!$&'()*+,;=]*)?)",
    url: (url: string) => url,
    width: 600,
    height: 800,
  },
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
