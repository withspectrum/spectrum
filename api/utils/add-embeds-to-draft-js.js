// @flow
import { EditorState, Entity, AtomicBlockUtils } from 'draft-js';

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

// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/master/draft-js-embed-plugin/src/modifiers/addEmbed.js
// adapted to pass additional attrs onto the iframe
export const addEmbed = (
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
  return EditorState.forceSelection(
    newEditorState,
    editorState.getCurrentContent().getSelectionAfter()
  );
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
