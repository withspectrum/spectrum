// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withNavigation, type NavigationProps } from 'react-navigation';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from '../../../shared/graphql/queries/community/getCommunityMembers';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import { LoadingListItem, UserListItem } from '../../components/Lists';

type Props = {
  data: {
    community: GetCommunityMembersType,
  },
  navigation: NavigationProps,
  isLoading: boolean,
  isFetchingMore: boolean,
  currentUser: Object,
};

class ModeratorList extends React.Component<Props> {
  shouldComponentUpdate() {
    // NOTE(@brian) This is needed to avoid conflicting the the members tab in
    // the community view. See https://github.com/withspectrum/spectrum/pull/2613#pullrequestreview-105861623
    // for discussion
    // never update once we have the list of team members
    if (this.props.data && this.props.data.community) return false;
    return true;
  }

  render() {
    const { data: { community }, isLoading, navigation } = this.props;

    if (community && community.members) {
      const { edges: members } = community.members;
      const nodes = members
        .map(member => member && member.node)
        .filter(node => node && (node.isOwner || node.isModerator));

      return (
        <React.Fragment>
          {nodes.map((node, index) => {
            if (!node) return null;
            const { user } = node;

            return (
              <UserListItem
                key={user.id}
                onPressHandler={() =>
                  navigation.navigate({
                    routeName: 'User',
                    key: user.id,
                    params: { id: user.id },
                  })
                }
                user={user}
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
  getCommunityMembersQuery,
  ViewNetworkHandler
)(ModeratorList);
