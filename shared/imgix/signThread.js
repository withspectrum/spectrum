// @flow
import type { DBThread } from 'shared/types';
import { signImageUrl } from 'shared/imgix';
const url = require('url');

const signBody = (body?: string, expires?: number): string => {
  if (!body) {
    return JSON.stringify({
      blocks: [
        {
          key: 'foo',
          text: '',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    });
  }

  const returnBody = JSON.parse(body);

  const imageKeys = Object.keys(returnBody.entityMap).filter(
    key => returnBody.entityMap[key].type.toLowerCase() === 'image'
  );

  imageKeys.forEach((key, index) => {
    if (!returnBody.entityMap[key]) return;

    const { src } = returnBody.entityMap[key].data;

    // transform the body inline with signed image urls
    const imageUrlStoredAsSigned =
      src &&
      (src.indexOf('https://spectrum.imgix.net') >= 0 ||
        src.indexOf('https://spectrum-proxy.imgix.net') >= 0);
    // if the image was stored in the db as a signed url (eg. after the plaintext update to the thread editor)
    // we need to remove all query params from the src, then re-sign in order to avoid duplicate signatures
    // or sending down a url with an expired signature
    if (imageUrlStoredAsSigned) {
      const { pathname } = url.parse(src);
      // always attempt to use the parsed pathname, but fall back to the original src
      const sanitized = decodeURIComponent(
        pathname ? pathname.replace(/^\//, '') : src
      );
      returnBody.entityMap[key].data.src = signImageUrl(sanitized, { expires });
    } else {
      returnBody.entityMap[key].data.src = signImageUrl(src, { expires });
    }
  });

  return JSON.stringify(returnBody);
};

export const signThread = (thread: DBThread, expires?: number): DBThread => {
  const { content, ...rest } = thread;

  return {
    ...rest,
    content: {
      ...content,
      body: signBody(content.body, expires),
    },
  };
};
