// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Route, Switch, Redirect } from 'react-router';
//$FlowFixMe
import styled, { ThemeProvider } from 'styled-components';
import generateMetaInfo from 'shared/generate-meta-info';
import { theme } from './components/theme';
import { FlexCol } from './components/globals';
import ScrollManager from './components/scrollManager';
import Head from './components/head';
import ModalRoot from './components/modals/modalRoot';
import Gallery from './components/gallery';
import Toasts from './components/toasts';
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
import communitySettings from './views/communitySettings';
import channelSettings from './views/channelSettings';
import NewCommunity from './views/newCommunity';
import Splash from './views/splash';
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
  overflow-y: scroll;
  background: ${props => props.theme.bg.wash};

  @media (max-width: 768px) {
    height: 100vh;
    max-height: ${window.innerHeight}px;
  }
`;

class Routes extends Component {
  render() {
    const { title, description } = generateMetaInfo();

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
              <Route
                exact
                path="/"
                component={signedOutFallback(Dashboard, Splash)}
              />
              <Route
                exact
                path="/home"
                component={signedOutFallback(Dashboard, Splash)}
              />

              {/* Public Business Pages */}
              <Route path="/about" component={About} />
              <Route path="/contact" component={About} />
              <Route path="/terms" component={About} />
              <Route path="/code-of-conduct" component={About} />
              <Route path="/style-guide" component={StyleGuide} />

              {/* App Pages */}
              <Route path="/new/community" component={NewCommunity} />
              <Route
                path="/new"
                render={() => <Redirect to="/new/community" />}
              />
              <Route path="/login" component={Login} />
              <Route path="/explore" component={Explore} />
              <Route
                path="/messages/new"
                component={signedOutFallback(DirectMessages, Login)}
              />
              <Route
                path="/messages/:threadId"
                component={signedOutFallback(DirectMessages, Login)}
              />
              <Route
                path="/messages"
                component={signedOutFallback(DirectMessages, Login)}
              />
              <Route path="/thread" component={Thread} />
              <Route exact path="/users" render={() => <Redirect to="/" />} />
              <Route exact path="/users/:username" component={UserView} />
              <Route
                exact
                path="/users/:username/settings"
                component={UserSettings}
              />
              <Route
                path="/notifications"
                component={signedOutFallback(Notifications, Login)}
              />

              {/*
              We check communitySlug last to ensure none of the above routes
              pass. We handle null communitySlug values downstream by either
              redirecting to home or showing a 404
            */}
              <Route
                path="/:communitySlug/:channelSlug/settings"
                component={channelSettings}
              />
              <Route
                path="/:communitySlug/settings"
                component={communitySettings}
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
