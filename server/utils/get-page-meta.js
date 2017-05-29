// @flow
const { parse } = require('url');

type Meta = {
  title: string,
  description: string,
};

const DEFAULT_META = {
  title: 'Spectrum',
  description: 'Where communities live.',
};

const setDefault = (input: Meta): Meta => {
  return Object.assign({}, DEFAULT_META, input);
};

export default (
  url: string,
  request: (query: string) => Promise
): Promise<Meta> => {
  const { pathname = '' } = parse(url);
  const [, first, second, third] = pathname.split('/');
  if (third || first.length === 0) return Promise.resolve(DEFAULT_META);
  let promise;

  switch (first) {
    case 'thread': {
      /**
       * Thread
       */
      promise = request(
        /* GraphQL */ `
        {
          thread(id: "${second}") {
            content {
              title
              body
              channel {
                name
              }
            }
          }
        }
      `
      ).then(res => {
        const { thread: { content, channel } } = res.data;
        return setDefault({
          title: `${content.title} | ${channel.name}`,
          description: content.body,
        });
      });
      break;
    }
    case 'users': {
      /**
       * User
       */
      promise = request(
        /* GraphQL */ `
        {
          user(id: "${second}") {
            name
            username
            description
            # coverPhoto
          }
        }
      `
      ).then(res => {
        const { user } = res.data;
        return setDefault({
          title: `${user.name} (${user.username})`,
          description: user.description,
        });
      });
      break;
    }
    default: {
      if (second) {
        /**
         * Channel
         */
        promise = request(
          /* GraphQL */ `
          {
            channel(channelSlug: "${second}", communitySlug: "${first}") {
              name
              description
              community {
                name
              }
            }
          }
        `
        ).then(res => {
          const { channel, channel: { community } } = res.data;
          return setDefault({
            title: `${channel.name} | ${community.name}`,
            description: channel.description,
          });
        });
        // TODO: Longer blacklist here
      } else if (first !== 'home' && first !== 'robots.txt') {
        /**
         * Community
         */
        promise = request(
          /* GraphQL */ `
          {
            community(slug: "${first}") {
              name
              description
            }
          }
        `
        ).then(res => {
          const { community } = res.data;
          return setDefault({
            title: `${community.name} on Spectrum`,
            description: community.description,
          });
        });
      }
      break;
    }
  }

  if (!promise) return Promise.resolve(DEFAULT_META);

  return promise.catch(err => {
    console.log(`⚠️ Failed to load metadata for ${url}! ⚠️`);
    console.log(err);
    return DEFAULT_META;
  });
};
