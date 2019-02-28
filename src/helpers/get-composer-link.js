// @flow
import qs from 'query-string';

type Props = {
  communityId?: ?string,
  channelId?: ?string,
};

const getComposerLink = (props: Props) => {
  const { communityId, channelId } = props;
  return {
    pathname: `/new/thread`,
    search: qs.stringify({
      composerCommunityId: communityId && communityId,
      composerChannelId: channelId && channelId,
    }),
  };
};

export default getComposerLink;
