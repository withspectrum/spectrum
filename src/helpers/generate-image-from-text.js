// @flow
// Generates a meta image which shows a title and a footer text on a nice Spectrum background.
import theme from 'shared/theme';
import { btoa } from 'abab';
import { stringify } from 'query-string';

// NOTES(@mxstbr):
// Imgix has a useful ~text endpoint that allows us to add text to any image, but unfortunately that endpoint only allows us to add one piece of text to an image—but we need two!
// We work around this by generating two images that only contain the text of the title and the footer respectively, nothing else, and then using the blend option to blend the background image with the title image (which only has the title text) and used the mark option to add our footer text as a "watermark" to the footer.

const WIDTH = 1500;
const IMGIX_TEXT_ENDPOINT = 'https://assets.imgix.net/~text';

const TITLE_PARAMS = {
  w: WIDTH * 0.8, // 10% padding on each side
  h: 350, // Magic number, clips text after four lines
  txtsize: 56,
  txtfont: 'Helvetica,Bold',
  txtalign: 'center,middle', // Center the text on both axis
  txtcolor: 'ffffff',
  // NOTE(@mxstbr): txtclip (i.e. ellipsis on overflowing text) only works with single-line text, which titles aren't, so this doesn't do anything rn
  txtclip: 'end,ellipsis',
};

const FOOTER_PARAMS = {
  h: 64,
  txtsize: 32,
  txtcolor: theme.brand.default.replace('#', ''),
  txtalign: 'right,middle',
  txtfont: 'Helvetica,Bold',
};

const BACKGROUND_URL = `http://spectrum.imgix.net/default_images/twitter-share-card.png`;

type GetMetaImageInput = {
  title: string,
  footer: string,
};

const generateImageFromText = ({ title, footer }: GetMetaImageInput) => {
  const titleUrl = `${IMGIX_TEXT_ENDPOINT}?${stringify(
    { ...TITLE_PARAMS, txt: title },
    { encode: false }
  )}`;
  const footerUrl = `${IMGIX_TEXT_ENDPOINT}?${stringify(
    { ...FOOTER_PARAMS, txt: footer },
    { encode: false }
  )}`;

  const BACKGROUND_PARAMS = {
    w: WIDTH,
    bm: 'normal', // Blend the title normally, don't change opacity or color or anything, just overlay it
    blend64: btoa(titleUrl),
    mark64: btoa(footerUrl),
  };

  return `${BACKGROUND_URL}?${stringify(BACKGROUND_PARAMS, { encode: false })}`;
};

export default generateImageFromText;
