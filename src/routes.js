// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Router, Route, Switch, Redirect } from 'react-router';
//$FlowFixMe
import styled from 'styled-components';
import generateMetaInfo from 'server/shared/generate-meta-info';
import { FlexCol } from './components/globals';
import { history } from './helpers/history';
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

  @media(max-width: 768px) {
    height: ${window.innerHeight}px;
  }
`;

class Routes extends Component {
  render() {
    const { title, description } = generateMetaInfo();
    return (
      <Router history={history}>
        <ScrollManager>
          <Body>
            {/* Default meta tags, get overriden by anything further down the tree */}
            <Head title={title} description={description} />
            {/* Global navigation, notifications, message notifications, etc */}
            <Route component={Navbar} />
            <Route component={ModalRoot} />
            <Route component={Toasts} />
            <Route component={Gallery} />

            {/*
              Switch only renders the first match. Subrouting happens downstream
              https://reacttraining.com/react-router/web/api/Switch
            */}
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/home" component={Dashboard} />

              {/* Public Business Pages */}
              <Route path="/about" component={About} />
              <Route path="/contact" component={About} />
              <Route path="/terms" component={About} />
              <Route path="/code-of-conduct" component={About} />
              <Route path="/style-guide" component={StyleGuide} />

              {/* App Pages */}
              <Route path="/explore" component={Explore} />
              <Route path="/messages/new" component={DirectMessages} />
              <Route path="/messages/:threadId" component={DirectMessages} />
              <Route path="/messages" component={DirectMessages} />
              <Route path="/thread" component={Thread} />
              <Route exact path="/users" render={() => <Redirect to="/" />} />
              <Route exact path="/users/:username" component={UserView} />
              <Route
                exact
                path="/users/:username/settings"
                component={UserSettings}
              />
              <Route path="/notifications" component={Notifications} />

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
      </Router>
    );
  }
}

export default Routes;
