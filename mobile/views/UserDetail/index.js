// @flow
import * as React from 'react';
import { Share, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import {
  ListItemWithButton,
  ListSectionDivider,
  ListSection,
  CommunityListItem,
} from '../../components/Lists';
import Loading from '../../components/Loading';
import { FullscreenNullState } from '../../components/NullStates';
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
        <ScrollView>
          {user.communityConnection.edges &&
            user.communityConnection.edges.length > 0 && (
              <React.Fragment>
                <ListSectionDivider title="Member of" />
                <ListSection>
                  {user.communityConnection.edges
                    .filter(Boolean)
                    .map(({ node: community }, index) => (
                      <CommunityListItem
                        key={community.id}
                        community={community}
                        divider={
                          index !== user.communityConnection.edges.length - 1
                        }
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
              </React.Fragment>
            )}

          <ListSectionDivider />

          <ListSection>
            <ListItemWithButton
              title="Share"
              onPressHandler={this.share}
              divider={false}
            />
          </ListSection>

          {currentUser &&
            currentUser.id === user.id && (
              <React.Fragment>
                <ListSectionDivider />

                <ListSection>
                  <ListItemWithButton
                    type="destructive"
                    title="Log Out"
                    onPressHandler={this.logout}
                    divider={false}
                  />
                </ListSection>
              </React.Fragment>
            )}

          <ListSectionDivider />
          <ListSectionDivider />
        </ScrollView>
      );
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <FullscreenNullState
        title={'We had trouble loading this user’s details'}
        subtitle={''}
      />
    );
  }
}

export default compose(
  connect(),
  withCurrentUser,
  getUserCommunityConnection,
  viewNetworkHandler
)(UserDetail);
