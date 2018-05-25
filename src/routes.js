// @flow
import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';
import Loadable from 'react-loadable';
import { ErrorBoundary } from 'src/components/error';
import { CLIENT_URL } from './api/constants';
import generateMetaInfo from 'shared/generate-meta-info';
import './reset.css.js';
import { theme } from 'shared/theme';
import { FlexCol } from './components/globals';
import ScrollManager from './components/scrollManager';
import Head from './components/head';
import ModalRoot from './components/modals/modalRoot';
import Gallery from './components/gallery';
import Toasts from './components/toasts';
import Maintenance from './components/maintenance';
import { Loading, LoadingScreen } from './components/loading';
import LoadingDashboard from './views/dashboard/components/dashboardLoading';
import Composer from './components/composer';
import signedOutFallback from './helpers/signed-out-fallback';
import AuthViewHandler from './views/authViewHandler';
import PrivateChannelJoin from './views/privateChannelJoin';
import PrivateCommunityJoin from './views/privateCommunityJoin';
import ThreadSlider from './views/threadSlider';
import Navbar from './views/navbar';
import Status from './views/status';
import Login from './views/login';

import DirectMessages from './views/directMessages';
import Thread from './views/thread';

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
  loading: ({ isLoading }) => isLoading && <LoadingDashboard />,
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
  background: ${props => props.theme.bg.wash};
`;

const DashboardFallback = signedOutFallback(Dashboard, Pages);
const HomeFallback = signedOutFallback(Dashboard, () => <Redirect to="/" />);
const NewCommunityFallback = signedOutFallback(NewCommunity, () => (
  <Redirect to={`/login?r=${CLIENT_URL}/new/community`} />
));
const MessagesFallback = signedOutFallback(DirectMessages, () => (
  <Redirect to="/login" />
));
const UserSettingsFallback = signedOutFallback(UserSettings, () => (
  <Redirect to="/login" />
));
const CommunitySettingsFallback = signedOutFallback(CommunitySettings, () => (
  <Redirect to="/login" />
));
const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () => (
  <Redirect to="/login" />
));
const NotificationsFallback = signedOutFallback(Notifications, () => (
  <Redirect to="/login" />
));
const ComposerFallback = signedOutFallback(Composer, () => (
  <Redirect to="/login" />
));

type Props = {
  maintenanceMode?: boolean,
};

class Routes extends React.Component<Props> {
  componentDidMount() {
    const AMPLITUDE_API_KEY =
      process.env.NODE_ENV === 'production'
        ? process.env.AMPLITUDE_API_KEY
        : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;
    if (AMPLITUDE_API_KEY) {
      try {
        window.amplitude.getInstance().init(AMPLITUDE_API_KEY);
        window.amplitude.getInstance().setOptOut(false);
      } catch (err) {
        console.warn('Unable to start tracking', err.message);
      }
    } else {
      console.warn('No amplitude api key, tracking in development mode');
    }
  }

  render() {
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
              <Route component={AuthViewHandler} />
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
                <Route path="/pricing" component={Pages} />
                <Route path="/support" component={Pages} />
                <Route path="/features" component={Pages} />
                <Route path="/faq" component={Pages} />

                {/* App Pages */}
                <Route path="/new/community" component={NewCommunityFallback} />
                <Route path="/new/thread" component={ComposerFallback} />
                <Route path="/new/search" component={Search} />

                <Route
                  path="/new"
                  render={() => <Redirect to="/new/community" />}
                />

                <Route path="/login" component={Login} />
                <Route path="/explore" component={Explore} />
                <Route path="/messages/new" component={MessagesFallback} />
                <Route
                  path="/messages/:threadId"
                  component={MessagesFallback}
                />
                <Route path="/messages" component={MessagesFallback} />
                <Route path="/thread/:threadId" component={Thread} />
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
                  component={CommunityLoginView}
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

export default Routes;
