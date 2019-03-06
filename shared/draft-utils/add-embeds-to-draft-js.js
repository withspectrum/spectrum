// @flow
import genKey from 'draft-js/lib/generateRandomKey';
import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState.js';

const FIGMA_URLS = /\b((?:https?\/\/)?(?:www\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?)/gi;
const YOUTUBE_URLS = /\b(?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/gi;
const VIMEO_URLS = /\b(?:\/\/)?(?:www\.)?vimeo.com\/(?:channels\/[0-9a-z-_]+\/)?([0-9a-z\-_]+)/gi;
const IFRAME_TAG = /<iframe.+?src=['"](.+?)['"]/gi;
const FRAMER_URLS = /\b((?:https?\/\/)?(?:www\.)?(?:framer\.cloud|share\.framerjs\.com)(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gi;
const CODEPEN_URLS = /\b(?:\/\/)?(?:www\.)?codepen\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const CODESANDBOX_URLS = /\b(?:\/\/)?(?:www\.)?codesandbox\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const SIMPLECAST_URLS = /\b(?:\/\/)?(?:www\.)?simplecast\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const THREAD_URLS = /(?:(?:https?:\/\/)?|\B)(?:spectrum\.chat|localhost:3000)\/.*?(?:~|(?:\?|&)t=|(?:\?|&)thread=|thread\/)([^&\s]*)/gi;

type InternalEmbedData = {|
  type: 'internal',
  entity: 'thread',
  id: string,
|};

type ExternalEmbedData = {|
  url: string,
  aspectRatio?: string,
  width?: number,
  height?: number,
|};

type EmbedData = InternalEmbedData | ExternalEmbedData;

export const addEmbedsToEditorState = (
  input: RawDraftContentState
): RawDraftContentState => {
  let lastEntityKey = Math.max(...Object.keys(input.entityMap));
  if (lastEntityKey === Infinity) lastEntityKey = -1;
  let newEntityMap = input.entityMap || {};
  let newBlocks = [];

  // Detect the embeds and add an atomic block and an entity to the
  // raw content state for each one
  input.blocks.forEach((block, index) => {
    newBlocks.push(block);

    if (block.type !== 'unstyled') return;

    const embeds = getEmbedsFromText(block.text);
    if (!embeds.length === 0) return;

    embeds.forEach(embed => {
      lastEntityKey++;
      const entityKey = lastEntityKey;
      newBlocks.push({
        type: 'atomic',
        data: {},
        text: ' ',
        depth: 0,
        // TODO
        entityRanges: [
          {
            offset: 0,
            length: 1,
            key: entityKey,
          },
        ],
        inlineStyleRanges: [],
        key: genKey(),
      });
      newEntityMap[entityKey] = {
        data: {
          ...embed,
          ...(embed.url ? { src: embed.url } : {}),
        },
        mutability: 'MUTABLE',
        type: 'embed',
      };
    });
    // If this is the last block we need to add an empty block below the atomic block,
    // otherwise users cannot remove the embed during editing
    if (index === input.blocks.length - 1) {
      newBlocks.push({
        type: 'unstyled',
        data: {},
        text: ' ',
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: genKey(),
      });
    }
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
    embeds.push({ url });
  });

  match(FIGMA_URLS, text).forEach(url => {
    embeds.push({
      url: `https://www.figma.com/embed?embed_host=spectrum&url=${url}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    });
  });

  match(YOUTUBE_URLS, text).forEach(id => {
    embeds.push({
      url: `https://www.youtube.com/embed/${id}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    });
  });

  match(VIMEO_URLS, text).forEach(id => {
    embeds.push({
      url: `https://player.vimeo.com/video/${id}`,
      aspectRatio: '56.25%', // 16:9 aspect ratio
    });
  });

  match(FRAMER_URLS, text).forEach(url => {
    embeds.push({
      url: `https://${url}`,
      width: 600,
      height: 800,
    });
  });

  match(CODEPEN_URLS, text).forEach(path => {
    embeds.push({
      url: `https://codepen.io${path.replace(/(pen|full|details)/, 'embed')}`,
      height: 300,
    });
  });

  match(CODESANDBOX_URLS, text).forEach(path => {
    embeds.push({
      url: `https://codesandbox.io${path.replace('/s/', '/embed/')}`,
      height: 500,
    });
  });

  match(SIMPLECAST_URLS, text).forEach(path => {
    embeds.push({
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
