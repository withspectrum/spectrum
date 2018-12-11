// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { Route, Switch, Redirect } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';
import Loadable from 'react-loadable';
import { ErrorBoundary } from 'src/components/error';
import { CLIENT_URL } from './api/constants';
import generateMetaInfo from 'shared/generate-meta-info';
import './reset.css.js';
import { theme } from 'shared/theme';
import { FlexCol } from './components/globals';
import ScrollManager from 'src/components/scrollManager';
import Head from 'src/components/head';
import ModalRoot from 'src/components/modals/modalRoot';
import Gallery from 'src/components/gallery';
import Toasts from 'src/components/toasts';
import { Loading, LoadingScreen } from 'src/components/loading';
import Composer from 'src/components/composer';
import AuthViewHandler from 'src/views/authViewHandler';
import signedOutFallback from 'src/helpers/signed-out-fallback';
import PrivateChannelJoin from 'src/views/privateChannelJoin';
import PrivateCommunityJoin from 'src/views/privateCommunityJoin';
import ThreadSlider from 'src/views/threadSlider';
import Navbar from 'src/views/navbar';
import Status from 'src/views/status';
import Login from 'src/views/login';
import DirectMessages from 'src/views/directMessages';
import { FullscreenThreadView } from 'src/views/thread';
import ThirdPartyContext from 'src/components/thirdPartyContextSetting';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Maintenance from 'src/components/maintenance';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import RedirectOldThreadRoute from './views/thread/redirect-old-route';

/* prettier-ignore */
const Explore = Loadable({
  loader: () => import('./views/explore'/* webpackChunkName: "Explore" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const UserView = Loadable({
  loader: () => import('./views/user'/* webpackChunkName: "UserView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const CommunityView = Loadable({
  loader: () => import('./views/community'/* webpackChunkName: "CommunityView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const CommunityLoginView = Loadable({
  loader: () => import('./views/communityLogin'/* webpackChunkName: "CommunityView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const ChannelView = Loadable({
  loader: () => import('./views/channel'/* webpackChunkName: "ChannelView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const Dashboard = Loadable({
  loader: () => import('./views/dashboard'/* webpackChunkName: "Dashboard" */),
  loading: ({ isLoading }) => isLoading && null,
});

/* prettier-ignore */
const Notifications = Loadable({
  loader: () => import('./views/notifications'/* webpackChunkName: "Notifications" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const UserSettings = Loadable({
  loader: () => import('./views/userSettings'/* webpackChunkName: "UserSettings" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const CommunitySettings = Loadable({
  loader: () => import('./views/communitySettings'/* webpackChunkName: "communitySettings" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const ChannelSettings = Loadable({
  loader: () => import('./views/channelSettings'/* webpackChunkName: "channelSettings" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const NewCommunity = Loadable({
  loader: () => import('./views/newCommunity'/* webpackChunkName: "NewCommunity" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const Pages = Loadable({
  loader: () => import('./views/pages'/* webpackChunkName: "Splash" */),
  loading: ({ isLoading }) => isLoading && null,
});

/* prettier-ignore */
const Search = Loadable({
  loader: () => import('./views/search'/* webpackChunkName: "Search" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const ErrorFallback = Loadable({
  loader: () => import('./components/error'/* webpackChunkName: "Error" */),
  loading: ({ isLoading }) => isLoading && <Loading />
});

const Body = styled(FlexCol)`
  display: flex;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  background: ${theme.bg.wash};
`;

const DashboardFallback = signedOutFallback(Dashboard, Pages);
const HomeFallback = signedOutFallback(Dashboard, () => <Redirect to="/" />);
const LoginFallback = signedOutFallback(() => <Redirect to="/" />, Login);
const CommunityLoginFallback = signedOutFallback(
  props => <Redirect to={`/${props.match.params.communitySlug}`} />,
  CommunityLoginView
);
const NewCommunityFallback = signedOutFallback(NewCommunity, () => (
  <Login redirectPath={`${CLIENT_URL}/new/community`} />
));
const MessagesFallback = signedOutFallback(DirectMessages, () => (
  <Login redirectPath={`${CLIENT_URL}/messages`} />
));
const UserSettingsFallback = signedOutFallback(UserSettings, () => (
  <Login redirectPath={`${CLIENT_URL}/me/settings`} />
));
const CommunitySettingsFallback = signedOutFallback(CommunitySettings, () => (
  <Login />
));
const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () => (
  <Login />
));
const NotificationsFallback = signedOutFallback(Notifications, () => (
  <Login redirectPath={`${CLIENT_URL}/notifications`} />
));
const ComposerFallback = signedOutFallback(Composer, () => (
  <Login redirectPath={`${CLIENT_URL}/new/thread`} />
));

type Props = {
  currentUser: ?GetUserType,
  isLoadingCurrentUser: boolean,
  maintenanceMode?: boolean,
};

class Routes extends React.Component<Props> {
  render() {
    const { currentUser, isLoadingCurrentUser } = this.props;
    const { title, description } = generateMetaInfo();

    if (this.props.maintenanceMode) {
      return (
        <ThemeProvider theme={theme}>
          <ScrollManager>
            <Body>
              <Head
                title="Ongoing Maintenance - Spectrum"
                description="Spectrum is currently undergoing scheduled maintenance downtime. Please check https://twitter.com/withspectrum for ongoing updates."
              />
              <Maintenance />
            </Body>
          </ScrollManager>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <ErrorBoundary fallbackComponent={ErrorFallback}>
          <ScrollManager>
            <Body>
              {/* Default meta tags, get overriden by anything further down the tree */}
              <Head title={title} description={description} />
              {/* Global navigation, notifications, message notifications, etc */}
              {/*
                AuthViewHandler often returns null, but is responsible for triggering
                things like the 'set username' prompt when a user auths and doesn't
                have a username set.
              */}
              <AuthViewHandler>{() => null}</AuthViewHandler>
              <ThirdPartyContext />
              <Status />
              <Route component={Navbar} />

              <Route component={ModalRoot} />
              <Route component={Toasts} />
              <Route component={Gallery} />
              <Route component={ThreadSlider} />

              {/*
                  Switch only renders the first match. Subrouting happens downstream
                  https://reacttraining.com/react-router/web/api/Switch
                */}
              <Switch>
                <Route exact path="/" component={DashboardFallback} />
                <Route exact path="/home" component={HomeFallback} />

                {/* Public Business Pages */}
                <Route path="/about" component={Pages} />
                <Route path="/contact" component={Pages} />
                <Route path="/terms" component={Pages} />
                <Route path="/privacy" component={Pages} />
                <Route path="/terms.html" component={Pages} />
                <Route path="/privacy.html" component={Pages} />
                <Route path="/code-of-conduct" component={Pages} />
                <Route path="/support" component={Pages} />
                <Route path="/features" component={Pages} />
                <Route path="/faq" component={Pages} />
                <Route path="/apps" component={Pages} />

                {/* App Pages */}
                <Route path="/new/community" component={NewCommunityFallback} />
                <Route path="/new/thread" component={ComposerFallback} />
                <Route path="/new/search" component={Search} />

                <Route
                  path="/new"
                  render={() => <Redirect to="/new/community" />}
                />

                <Route path="/login" component={LoginFallback} />
                <Route path="/explore" component={Explore} />
                <Route path="/messages/new" component={MessagesFallback} />
                <Route
                  path="/messages/:threadId"
                  component={MessagesFallback}
                />
                <Route path="/messages" component={MessagesFallback} />
                <Route
                  path="/thread/:threadId"
                  component={RedirectOldThreadRoute}
                />
                <Route path="/thread" render={() => <Redirect to="/" />} />
                <Route exact path="/users" render={() => <Redirect to="/" />} />
                <Route exact path="/users/:username" component={UserView} />
                <Route
                  exact
                  path="/users/:username/settings"
                  component={UserSettingsFallback}
                />
                <Route
                  path="/notifications"
                  component={NotificationsFallback}
                />

                <Route
                  path="/me/settings"
                  render={() =>
                    currentUser && currentUser.username ? (
                      <Redirect
                        to={`/users/${currentUser.username}/settings`}
                      />
                    ) : isLoadingCurrentUser ? null : (
                      <Login redirectPath={`${CLIENT_URL}/me/settings`} />
                    )
                  }
                />
                <Route
                  path="/me"
                  render={() =>
                    currentUser && currentUser.username ? (
                      <Redirect to={`/users/${currentUser.username}`} />
                    ) : isLoadingCurrentUser ? null : (
                      <Login redirectPath={`${CLIENT_URL}/me`} />
                    )
                  }
                />

                {/*
                    We check communitySlug last to ensure none of the above routes
                    pass. We handle null communitySlug values downstream by either
                    redirecting to home or showing a 404
                  */}
                <Route
                  path="/:communitySlug/:channelSlug/settings"
                  component={ChannelSettingsFallback}
                />
                <Route
                  path="/:communitySlug/:channelSlug/join/:token"
                  component={PrivateChannelJoin}
                />
                <Route
                  path="/:communitySlug/:channelSlug/join"
                  component={PrivateChannelJoin}
                />
                <Route
                  path="/:communitySlug/settings"
                  component={CommunitySettingsFallback}
                />
                <Route
                  path="/:communitySlug/join/:token"
                  component={PrivateCommunityJoin}
                />
                <Route
                  path="/:communitySlug/login"
                  component={CommunityLoginFallback}
                />
                <Route
                  // NOTE(@mxstbr): This custom path regexp matches threadId correctly in all cases, no matter if we prepend it with a custom slug or not.
                  // Imagine our threadId is "id-123-id" (similar in shape to an actual UUID)
                  // - /id-123-id => id-123-id, easy start that works
                  // - /some-custom-slug~id-123-id => id-123-id, custom slug also works
                  // - /~id-123-id => id-123-id => id-123-id, empty custom slug also works
                  // - /some~custom~slug~id-123-id => id-123-id, custom slug with delimiter char in it (~) also works! :tada:
                  path="/:communitySlug/:channelSlug/(.*~)?:threadId"
                  component={FullscreenThreadView}
                />
                <Route
                  path="/:communitySlug/:channelSlug"
                  component={ChannelView}
                />
                <Route path="/:communitySlug" component={CommunityView} />
              </Switch>
            </Body>
          </ScrollManager>
        </ErrorBoundary>
      </ThemeProvider>
    );
  }
}

export default compose(withCurrentUser)(Routes);
