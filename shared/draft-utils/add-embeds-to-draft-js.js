// @flow
import genKey from 'draft-js/lib/generateRandomKey';
import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState.js';

const FIGMA_URLS = /\b((?:https?:\/\/)?(?:www\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?)/gi;
const YOUTUBE_URLS = /\b(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/gi;
const VIMEO_URLS = /\b(?:https?:\/\/)?(?:www\.)?vimeo.com\/(?:channels\/[0-9a-z-_]+\/)?([0-9a-z\-_]+)/gi;
const IFRAME_TAG = /<iframe.+?src=['"](.+?)['"]/gi;
const FRAMER_URLS = /\b(?:https?:\/\/)?(?:www\.)?(?:framer\.cloud|share\.framerjs\.com)\/([A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const CODEPEN_URLS = /\b(?:https?:\/\/)?(?:www\.)?codepen\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const CODESANDBOX_URLS = /\b(?:https?:\/\/)?(?:www\.)?codesandbox\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const SIMPLECAST_URLS = /\b(?:https?:\/\/)?(?:www\.)?simplecast\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const THREAD_URLS = /(?:(?:https?:\/\/)?|\B)(?:spectrum\.chat|localhost:3000)\/.*?(?:~|(?:\?|&)t=|(?:\?|&)thread=|thread\/)([^&\s]*)/gi;

const REGEXPS = {
  figma: FIGMA_URLS,
  youtube: YOUTUBE_URLS,
  vimeo: VIMEO_URLS,
  iframe: IFRAME_TAG,
  framer: FRAMER_URLS,
  codepen: CODEPEN_URLS,
  codesandbox: CODESANDBOX_URLS,
  simplecast: SIMPLECAST_URLS,
  internal: THREAD_URLS,
};

export type InternalEmbedData = {
  type: 'internal',
  entity: 'thread',
  id: string,
};

export type ExternalEmbedData = {
  url: string,
  type:
    | 'figma'
    | 'youtube'
    | 'vimeo'
    | 'iframe'
    | 'framer'
    | 'codepen'
    | 'codesandbox'
    | 'simplecast',
  aspectRatio?: string,
  width?: number,
  height?: number,
};

export type EmbedData = InternalEmbedData | ExternalEmbedData;

export const addEmbedsToEditorState = (
  input: RawDraftContentState
): RawDraftContentState => {
  let lastEntityKey = Math.max(...Object.keys(input.entityMap));
  if (lastEntityKey === -Infinity || lastEntityKey === Infinity)
    lastEntityKey = -1;
  let newEntityMap = input.entityMap || {};
  let newBlocks = [];

  // Detect the embeds and add an atomic block and an entity to the
  // raw content state for each one
  input.blocks.forEach((block, blockIndex) => {
    newBlocks.push(block);

    if (block.type !== 'unstyled') return;

    const embeds = getEmbedsFromText(block.text);
    if (embeds.length === 0) return;

    embeds.forEach(embed => {
      lastEntityKey++;
      const entityKey = lastEntityKey;
      newEntityMap[entityKey] = {
        data: {
          ...embed,
          ...(embed.url ? { src: embed.url } : {}),
        },
        mutability: 'MUTABLE',
        type: 'embed',
      };
      const regexp = new RegExp(REGEXPS[embed.type], 'ig');
      const text = block.text;
      var match;
      while ((match = regexp.exec(text)) !== null) {
        const offset = match.index;
        const length = match[0].length;
        newBlocks[blockIndex].entityRanges = newBlocks[
          blockIndex
        ].entityRanges.filter(
          entity => entity.offset !== offset || entity.length !== length
        );
        newBlocks[blockIndex].entityRanges.push({
          offset,
          length,
          key: entityKey,
        });
      }
    });
  });

  return {
    ...input,
    entityMap: newEntityMap,
    blocks: newBlocks,
  };
};

// Utility function to return the first capturing group of each unique match
// of a regex in a string
const match = (regex: RegExp, text: string) => {
  const matches = text.match(regex);
  if (!matches) return [];
  return [...new Set(matches)].map(match => {
    return regex.exec(match)[1];
  });
};

export const getEmbedsFromText = (text: string): Array<EmbedData> => {
  let embeds = [];

  match(IFRAME_TAG, text).forEach(url => {
    embeds.push({ type: 'iframe', url });
  });

  match(FIGMA_URLS, text).forEach(url => {
    embeds.push({
      type: 'figma',
      url: `https://www.figma.com/embed?embed_host=spectrum&url=${url}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    });
  });

  match(YOUTUBE_URLS, text).forEach(id => {
    embeds.push({
      type: 'youtube',
      url: `https://www.youtube.com/embed/${id}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    });
  });

  match(VIMEO_URLS, text).forEach(id => {
    embeds.push({
      type: 'vimeo',
      url: `https://player.vimeo.com/video/${id}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    });
  });

  match(FRAMER_URLS, text).forEach(id => {
    embeds.push({
      type: 'framer',
      url: `https://share.framerjs.com/${id}`,
      width: 600,
      height: 800,
    });
  });

  match(CODEPEN_URLS, text).forEach(path => {
    embeds.push({
      type: 'codepen',
      url: `https://codepen.io${path.replace(/(pen|full|details)/, 'embed')}`,
      height: 300,
    });
  });

  match(CODESANDBOX_URLS, text).forEach(path => {
    embeds.push({
      type: 'codesandbox',
      url: `https://codesandbox.io${path.replace('/s/', '/embed/')}`,
      height: 500,
    });
  });

  match(SIMPLECAST_URLS, text).forEach(path => {
    embeds.push({
      type: 'simplecast',
      url: `https://embed.simplecast.com/${path
        .replace('/s/', '')
        .replace('/', '')}`,
      height: 200,
    });
  });

  match(THREAD_URLS, text).forEach(id => {
    embeds.push({
      type: 'internal',
      id,
      entity: 'thread',
    });
  });

  return embeds;
};
