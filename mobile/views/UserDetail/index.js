// @flow
import React, { Fragment } from 'react';
import { Share } from 'react-native';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  ListItemWithButton,
  ListSectionDivider,
  ListSection,
  ListItemWithTitle,
  CommunityListItem,
} from '../../components/Lists';
import Loading from '../../components/Loading';
import Text from '../../components/Text';
import {
  withCurrentUser,
  type WithCurrentUserProps,
} from '../../components/WithCurrentUser';
import viewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import { logout } from '../../actions/authentication';
import {
  getUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from '../../../shared/graphql/queries/user/getUserCommunityConnection';
import type { NavigationProp } from 'react-navigation';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  ...$Exact<WithCurrentUserProps>,
  navigation: NavigationProp,
  id: string,
  dispatch: Function,
  data: {
    user?: GetUserCommunityConnectionType,
  },
};

class UserDetail extends React.Component<Props> {
  navigateToCommunity = (communityId: string) => () => {
    this.props.navigation.navigate('Community', { id: communityId });
  };

  logout = () => {
    this.props.dispatch(logout());
  };

  share = () => {
    const { user } = this.props.data;

    if (!user) return;

    return Share.share(
      {
        url: `https://spectrum.chat/users/${user.username}`,
        title: `${user.name} (@${user.username}) on Spectrum`,
      },
      {
        subject: `${user.name} (@${user.username}) on Spectrum`,
      }
    );
  };

  render() {
    const {
      currentUser,
      data: { user },
      isLoading,
      hasError,
      navigation,
    } = this.props;

    if (user) {
      return (
        <Fragment>
          <ListSectionDivider title="Member of" />
          <ListSection>
            {user.communityConnection.edges
              .filter(Boolean)
              .map(({ node: community }, index) => (
                <CommunityListItem
                  key={community.id}
                  community={community}
                  divider={index !== user.communityConnection.edges.length - 1}
                  onPressHandler={() =>
                    navigation.navigate({
                      routeName: 'Community',
                      key: community.id,
                      params: { id: community.id },
                    })
                  }
                />
              ))}
          </ListSection>

          <ListSectionDivider />
          <ListSection>
            <ListItemWithButton title="Share" onPressHandler={this.share} />
            {currentUser &&
              currentUser.id === user.id && (
                <ListItemWithButton
                  type="destructive"
                  title="Log Out"
                  onPressHandler={this.logout}
                />
              )}
          </ListSection>
        </Fragment>
      );
    }

    if (hasError) return <Text type="title1">Error!</Text>;

    if (isLoading) return <Loading />;

    return null;
  }
}

export default compose(
  connect(),
  withCurrentUser,
  getUserCommunityConnection,
  viewNetworkHandler
)(UserDetail);
