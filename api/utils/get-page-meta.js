const { parse } = require('url');
const generateMetaInfo = require('../../shared/generate-meta-info');

// Don't even try if the path is /<value> any of these
// TODO: Longer, more complete deny list here
const PATH_DENY_LIST = ['robots.txt', 'home', 'messages', 'notifications'];

type Meta = {
  title: string,
  description: string,
  extra: string,
};

export default (
  url: string,
  request: (query: string) => Promise
): Promise<Meta> => {
  const { pathname = '' } = parse(url);
  const [, first, second, third] = pathname.split('/');
  if (third || first.length === 0) return Promise.resolve(generateMetaInfo());
  let promise;

  switch (first) {
    case 'explore': {
      promise = Promise.resolve(generateMetaInfo({ type: 'explore' }));
      break;
    }
    case 'thread': {
      /**
       * Thread
       */
      promise = request(/* GraphQL */ `
        {
          thread(id: "${second}") {
            content {
              title
              body
            }
            type
            channel {
              name
              isPrivate
            }
            community {
              profilePhoto
            }
          }
        }
      `).then(res => {
        const {
          thread: { type, content, channel },
        } = res.data;
        return generateMetaInfo({
          type: 'thread',
          data: {
            title: content.title,
            type,
            body: content.body,
            channelName: channel.name,
            privateChannel: channel.isPrivate,
            image: community.profilePhoto,
          },
        });
      });
      break;
    }
    case 'users': {
      /**
       * User
       */
      promise = request(/* GraphQL */ `
        {
          user(username: "${second}") {
            name
            username
            description
            profilePhoto
            # coverPhoto
          }
        }
      `).then(res => {
        const { user } = res.data;
        return generateMetaInfo({
          type: 'user',
          data: {
            username: user.username,
            description: user.description,
            name: user.name,
            image: user.profilePhoto,
          },
        });
      });
      break;
    }
    default: {
      const isDenyListed = PATH_DENY_LIST.includes(first);
      if (second && !isDenyListed) {
        /**
         * Channel
         */
        promise = request(/* GraphQL */ `
          {
            channel(channelSlug: "${second}", communitySlug: "${first}") {
              name
              description
              isPrivate
              community {
                name
                profilePhoto
              }
            }
          }
        `).then(res => {
          const {
            channel,
            channel: { community },
          } = res.data;
          return generateMetaInfo({
            type: 'channel',
            data: {
              name: channel.name,
              description: channel.description,
              communityName: community.name,
              private: channel.isPrivate,
              image: community.profilePhoto,
            },
          });
        });
      } else if (!isDenyListed) {
        /**
         * Community
         */
        promise = request(/* GraphQL */ `
          {
            community(slug: "${first}") {
              name
              description
              profilePhoto
            }
          }
        `).then(res => {
          const { community } = res.data;
          return generateMetaInfo({
            type: 'community',
            data: {
              name: community.name,
              description: community.description,
              image: community.profilePhoto,
            },
          });
        });
      }
      break;
    }
  }

  if (!promise) return Promise.resolve(generateMetaInfo());

  return promise.catch(err => {
    console.error(`⚠️ Failed to load metadata for ${url}! ⚠️`);
    console.error(err);
    return generateMetaInfo();
  });
};
