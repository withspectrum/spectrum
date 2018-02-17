// @flow
import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';
import Loadable from 'react-loadable';
import { CLIENT_URL } from './api/constants';
import generateMetaInfo from 'shared/generate-meta-info';
import './reset.css.js';
import { theme } from './components/theme';
import { FlexCol } from './components/globals';
import ScrollManager from './components/scrollManager';
import Head from './components/head';
import ModalRoot from './components/modals/modalRoot';
import Gallery from './components/gallery';
import Toasts from './components/toasts';
import Maintenance from './components/maintenance';
import LoadingDMs from './views/directMessages/components/loading';
import LoadingThread from './views/thread/components/loading';
import { Loading, LoadingScreen } from './components/loading';
import LoadingDashboard from './views/dashboard/components/dashboardLoading';
import Composer from './components/composer';
import signedOutFallback from './helpers/signed-out-fallback';
import AuthViewHandler from './views/authViewHandler';

import ThreadSlider from './views/threadSlider';
import Navbar from './views/navbar';
import Login from './views/login';

/* prettier-ignore */
const DirectMessages = Loadable({
  loader: () => import('./views/directMessages'/* webpackChunkName: "DirectMessages" */),
  loading: ({ isLoading }) => isLoading && <LoadingDMs />,
});

/* prettier-ignore */
const Explore = Loadable({
  loader: () => import('./views/explore'/* webpackChunkName: "Explore" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const Thread = Loadable({
  loader: () => import('./views/thread'/* webpackChunkName: "Thread" */),
  loading: ({ isLoading }) => isLoading && <LoadingThread />,
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
const ChannelView = Loadable({
  loader: () => import('./views/channel'/* webpackChunkName: "ChannelView" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const StyleGuide = Loadable({
  loader: () => import('./views/pages/styleGuide'/* webpackChunkName: "StyleGuide" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
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
const Splash = Loadable({
  loader: () => import('./views/splash'/* webpackChunkName: "Splash" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const Search = Loadable({
  loader: () => import('./views/search'/* webpackChunkName: "Search" */),
  loading: ({ isLoading }) => isLoading && <LoadingScreen />,
});

/* prettier-ignore */
const Pricing = Loadable({
  loader: () => import('./views/splash/pricing'/* webpackChunkName: "Pricing" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

/* prettier-ignore */
const Support = Loadable({
  loader: () => import('./views/splash/support'/* webpackChunkName: "Support" */),
  loading: ({ isLoading }) => isLoading && <Loading />,
});

const Body = styled(FlexCol)`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.bg.wash};

  @media (max-width: 768px) {
    height: 100vh;
    max-height: 100vh;
  }
`;

const DashboardFallback = signedOutFallback(Dashboard, Splash);
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
const CommunityAnalyticsFallback = signedOutFallback(CommunitySettings, () => (
  <Redirect to="/login" />
));
const CommunityMembersFallback = signedOutFallback(CommunitySettings, () => (
  <Redirect to="/login" />
));
const ChannelSettingsFallback = signedOutFallback(ChannelSettings, () => (
  <Redirect to="/login" />
));
const NotificationsFallback = signedOutFallback(Notifications, () => (
  <Redirect to="/login" />
));

class Routes extends React.Component<{}> {
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
              <Route path="/about" component={Splash} />
              <Route path="/contact" component={Support} />
              <Route path="/terms" component={Support} />
              <Route path="/privacy" component={Support} />
              <Route path="/terms.html" component={Support} />
              <Route path="/privacy.html" component={Support} />
              <Route path="/code-of-conduct" component={Support} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/support" component={Support} />
              <Route path="/style-guide" component={StyleGuide} />
              <Route path="/new/search" component={Search} />

              {/* App Pages */}
              <Route path="/new/community" component={NewCommunityFallback} />
              <Route path="/new/thread" component={Composer} />
              <Route
                path="/new"
                render={() => <Redirect to="/new/community" />}
              />
              <Route path="/login" component={Login} />
              <Route path="/explore" component={Explore} />
              <Route path="/messages/new" component={MessagesFallback} />
              <Route path="/messages/:threadId" component={MessagesFallback} />
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
              <Route path="/notifications" component={NotificationsFallback} />

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
                path="/:communitySlug/settings/analytics"
                component={CommunityAnalyticsFallback}
              />
              <Route
                path="/:communitySlug/settings/members"
                component={CommunityMembersFallback}
              />
              <Route
                path="/:communitySlug/settings"
                component={CommunitySettingsFallback}
              />
              <Route
                path="/:communitySlug/:channelSlug"
                component={ChannelView}
              />
              <Route path="/:communitySlug" component={CommunityView} />
            </Switch>
          </Body>
        </ScrollManager>
      </ThemeProvider>
    );
  }
}

export default Routes;
