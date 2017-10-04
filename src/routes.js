// @flow
import * as React from 'react';
//$FlowFixMe
import { Route, Switch, Redirect } from 'react-router';
//$FlowFixMe
import styled, { ThemeProvider } from 'styled-components';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
import { theme } from './components/theme';
import { FlexCol } from './components/globals';
import ScrollManager from './components/scrollManager';
import Head from './components/head';
import ModalRoot from './components/modals/modalRoot';
import Gallery from './components/gallery';
import Toasts from './components/toasts';
import Maintenance from './components/maintenance';
import DirectMessages from './views/directMessages';
import Explore from './views/explore';
import Thread from './views/thread';
import UserView from './views/user';
import CommunityView from './views/community';
import ChannelView from './views/channel';
import Navbar from './views/navbar';
import StyleGuide from './views/pages/styleGuide';
import Dashboard from './views/dashboard';
import Notifications from './views/notifications';
import UserSettings from './views/userSettings';
import CommunitySettings from './views/communitySettings';
import CommunityAnalytics from './views/communityAnalytics';
import ChannelSettings from './views/channelSettings';
import NewCommunity from './views/newCommunity';
import Splash from './views/splash';
import Composer from './components/composer';
import signedOutFallback from './helpers/signed-out-fallback';
import { Login } from './views/login';
import ThreadSlider from './views/threadSlider';

const About = () => (
  <div>
    <h3>About</h3>
  </div>
);

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
  <Redirect to="/login" />
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
              <Route path="/about" component={About} />
              <Route path="/contact" component={About} />
              <Route path="/terms" component={About} />
              <Route path="/code-of-conduct" component={About} />
              <Route path="/style-guide" component={StyleGuide} />

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
              <Route path="/thread" component={Thread} />
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
