// @flow
import { genKey, ContentBlock } from 'draft-js';
import mentionsDecorator from '../index.web.js';
import type { ContentBlock as ContentBlockType } from 'draft-js/lib/ContentBlock';

type Mention = string;

const createContentBlock = (text: string): ContentBlockType =>
  new ContentBlock({
    depth: 0,
    text,
    key: genKey(),
    type: 'unstyled',
  });

// A little helper function to get the substringed mention text back
// rather than a list of indizes
const getMentions = (text: string): Array<Mention> => {
  const block = createContentBlock(text);
  let mentions = [];
  mentionsDecorator.strategy(block, (start, end) => {
    mentions.push(text.substr(start, end - start));
  });
  return mentions;
};

describe('strategy', () => {
  it('should return the start and end indizes of a mention', () => {
    const text = '@mxstbr';
    const block = createContentBlock(text);
    let mentions = [];
    mentionsDecorator.strategy(block, (start, end) => {
      mentions.push({ start, end });
    });
    expect(mentions[0].start).toEqual(0);
    expect(mentions[0].end).toEqual(7);
  });

  it('should handle a mention in the middle of a sentence', () => {
    const text = 'Hey @mxstbr how are you?';
    const mentions = getMentions(text);
    expect(mentions[0]).toEqual('@mxstbr');
  });

  it('should handle a mention at the end of a sentence', () => {
    const text = 'Hey @mxstbr';
    const mentions = getMentions(text);
    expect(mentions[0]).toEqual('@mxstbr');
  });

  it('should handle multiple mentions', () => {
    const text = 'Hey @mxstbr and @brian how are you';
    const mentions = getMentions(text);
    expect(mentions[0]).toEqual('@mxstbr');
    expect(mentions[1]).toEqual('@brian');
  });

  describe('edge cases', () => {
    it('should handle sentences with compound emojis (withspectrum/spectrum#2077)', () => {
      const text =
        "Hey @grdp 👋🏻, I'm sure the @rauchg should be more than willing to answer that question. 😀";
      const mentions = getMentions(text);
      expect(mentions[0]).toEqual('@grdp');
      expect(mentions[1]).toEqual('@rauchg');
    });
  });
});
