// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import getCurrentUserSettings, {
  type GetCurrentUserSettingsType,
} from 'shared/graphql/queries/user/getCurrentUserSettings';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Head from 'src/components/head';
import { View } from './style';
import Overview from './components/overview';
import Header from 'src/components/settingsViews/header';
import type { ContextRouter } from 'react-router';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import { ViewGrid } from 'src/components/layout';
import { setTitlebarProps } from 'src/actions/titlebar';

type Props = {
  data: {
    user: GetCurrentUserSettingsType,
  },
  isLoading: boolean,
  hasError: boolean,
  ...$Exact<ContextRouter>,
};

class UserSettings extends React.Component<Props> {
  componentDidMount() {
    const { dispatch } = this.props;
    return dispatch(
      setTitlebarProps({
        title: 'Settings',
      })
    );
  }

  render() {
    const {
      data: { user },
      match,
      isLoading,
      currentUser,
    } = this.props;

    if (isLoading) {
      return <LoadingView />;
    }

    // the user is logged in but somehow a user wasnt fetched from the server prompt a refresh to reauth the user
    if ((currentUser && !user) || (currentUser && user && !user.id)) {
      return <ErrorView />;
    }

    // user is viewing their own settings, validated on the server
    if (user && user.id && currentUser.id === user.id) {
      const subheading = {
        to: `/users/${user.username}`,
        label: `Return to profile`,
      };

      const avatar = {
        profilePhoto: user.profilePhoto,
        user,
      };

      return (
        <React.Fragment>
          <Head title={'My settings'} />
          <ViewGrid>
            <View data-cy="user-settings">
              <Header
                avatar={avatar}
                subheading={subheading}
                heading={'My Settings'}
              />

              <Route path={`${match.url}`}>
                {() => <Overview user={user} />}
              </Route>
            </View>
          </ViewGrid>
        </React.Fragment>
      );
    }

    return <ErrorView />;
  }
}

export default compose(
  getCurrentUserSettings,
  viewNetworkHandler,
  withCurrentUser,
  connect()
)(UserSettings);
