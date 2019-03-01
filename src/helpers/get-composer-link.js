// @flow
import qs from 'query-string';

type Props = {
  communityId?: ?string,
  channelId?: ?string,
};

const getComposerLink = (props: Props) => {
  const { communityId, channelId } = props;

  const search = {};
  if (communityId) search.communityId = communityId;
  if (channelId) search.channelId = channelId;

  return {
    pathname: `/new/thread`,
    search: qs.stringify(search),
  };
};

export default getComposerLink;
