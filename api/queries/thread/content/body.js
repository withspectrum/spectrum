// @flow
import type { DBThread } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export default (thread: DBThread, imageSignatureExpiration: number) => {
  const { content } = thread;

  if (!content.body) {
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

  // Replace the local image srcs with the remote image src
  const body = JSON.parse(content.body);

  const imageKeys = Object.keys(body.entityMap).filter(
    key => body.entityMap[key].type.toLowerCase() === 'image'
  );

  imageKeys.forEach((key, index) => {
    if (!body.entityMap[key]) return;

    const { src } = body.entityMap[key].data;

    // transform the body inline with signed image urls
    body.entityMap[key].data.src = signImageUrl(src, {
      expires: imageSignatureExpiration,
    });
  });

  return JSON.stringify(body);
};
