// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withNavigation, type NavigationProps } from 'react-navigation';
import getCommunityChannels, {
  type GetCommunityChannelConnectionType,
} from '../../../shared/graphql/queries/community/getCommunityChannelConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import { LoadingListItem, ListItemWithTitle } from '../../components/Lists';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  navigation: NavigationProps,
  isLoading: boolean,
  isFetchingMore: boolean,
  currentUser: Object,
};

class ChannelList extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading, navigation } = this.props;

    if (community && community.channelConnection) {
      const nodes = community.channelConnection.edges
        .map(channel => channel && channel.node)
        .filter(channel => {
          if (!channel) return null;
          if (channel.isPrivate && !channel.channelPermissions.isMember)
            return null;

          return channel;
        })
        .filter(channel => channel && !channel.channelPermissions.isBlocked);

      return (
        <React.Fragment>
          {nodes.map((node, index) => {
            if (!node) return null;

            return (
              <ListItemWithTitle
                key={node.id}
                onPressHandler={() =>
                  navigation.navigate({
                    routeName: 'Channel',
                    key: node.id,
                    params: { id: node.id },
                  })
                }
                title={`# ${node.name}`}
                divider={index !== nodes.length - 1}
              />
            );
          })}
        </React.Fragment>
      );
    }

    if (isLoading) {
      return <LoadingListItem divider={false} />;
    }

    return null;
  }
}

export default compose(
  withNavigation,
  getCommunityChannels,
  ViewNetworkHandler
)(ChannelList);
