// @flow
import {
  EditorState,
  Entity,
  AtomicBlockUtils,
  ContentState,
  convertToRaw,
  SelectionState,
} from 'draft-js';

const FIGMA_URLS = /\b((?:https?\/\/)?(?:www\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?)/gi;
const YOUTUBE_URLS = /\b(?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/gi;
const VIMEO_URLS = /\b(?:\/\/)?(?:www\.)?vimeo.com\/(?:channels\/[0-9a-z-_]+\/)?([0-9a-z\-_]+)/gi;
const IFRAME_TAG = /<iframe.+?src=['"](.+?)['"]/gi;
const FRAMER_URLS = /\b((?:https?\/\/)?(?:www\.)?(?:framer\.cloud|share\.framerjs\.com)(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gi;
const CODEPEN_URLS = /\b(?:\/\/)?(?:www\.)?codepen\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;
const CODESANDBOX_URLS = /\b(?:\/\/)?(?:www\.)?codesandbox\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/gi;

type AddEmbedAttrs = {
  url: string,
  aspectRatio?: string,
  width?: number,
  height?: number,
};

export const addEmbedsToEditorState = (
  editorState: typeof EditorState
): typeof EditorState => {
  const raw = convertToRaw(editorState.getCurrentContent());
  let newEditorState = editorState;
  raw.blocks.forEach(block => {
    if (block.type !== 'unstyled') return;
    const embeds = getEmbedsFromText(block.text);
    if (embeds.length > 0) {
      embeds.forEach(embed => {
        const selection = SelectionState.createEmpty(block.key);
        newEditorState = addEmbedToEditorState(newEditorState, embed);
      });
    }
  });
  return newEditorState;
};

// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/master/draft-js-embed-plugin/src/modifiers/addEmbed.js
// adapted to pass additional attrs onto the iframe
export const addEmbedToEditorState = (
  editorState: typeof EditorState,
  attrs: AddEmbedAttrs
) => {
  const urlType = 'embed';
  const entityKey = Entity.create(urlType, 'IMMUTABLE', {
    src: (attrs && attrs.url) || null,
    aspectRatio: attrs && attrs.aspectRatio,
    width: attrs && attrs.width,
    height: attrs && attrs.height,
  });
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  // insertAtomicBlock inserts _before_ the current block, which is not what we want,
  // so we have to manually move the new atomic block one further down
  const content = newEditorState.getCurrentContent();
  let newBlocks = [];
  let moveNext;
  content.getBlocksAsArray().forEach(block => {
    if (!moveNext) {
      newBlocks.push(block);
    } else {
      newBlocks = [
        ...newBlocks.slice(0, newBlocks.length - 2),
        block,
        ...newBlocks.slice(newBlocks.length - 2),
      ];
    }
    if (block.type === 'atomic' && block.getEntityAt(0) === entityKey) {
      // move the automatically added empty block above the atomic block below the atomic block
      newBlocks = [
        ...newBlocks.slice(0, newBlocks.length - 2),
        newBlocks[newBlocks.length - 1],
        newBlocks[newBlocks.length - 2],
      ];
      moveNext = true;
    }
  });
  const newContent = ContentState.createFromBlockArray(newBlocks);
  return EditorState.push(newEditorState, newContent, 'insert-characters');
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

export const getEmbedsFromText = (text: string): Array<AddEmbedAttrs> => {
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

  return embeds;
};
