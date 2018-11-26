// @flow
import type { DBThread } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

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
    returnBody.entityMap[key].data.src = signImageUrl(src, { expires });
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
