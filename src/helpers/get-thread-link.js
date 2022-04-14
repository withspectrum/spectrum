// @flow
import slugg from 'slugg';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';

const getThreadLink = (thread: ThreadInfoType) => {
  if (!thread.community || !thread.channel) return `/thread/${thread.id}`;
  return `/${thread.community.slug}/${thread.channel.slug}/${slugg(
    thread.content.title
  )}~${thread.id}`;
};

export default getThreadLink;
