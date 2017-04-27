// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Router, Route, Switch } from 'react-router';
//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import createBrowserHistory from 'history/createBrowserHistory';
import DirectMessages from './views/directMessages';
import Explore from './views/explore';
import Story from './views/story';
import UserProfile from './views/userProfile';
import CommunityProfile from './views/communityProfile';
import FrequencyProfile from './views/frequencyProfile';
import Navbar from './views/navbar';
import StyleGuide from './views/pages/styleGuide';
import Dashboard from './views/dashboard';
import Notifications from './views/notifications';

const About = () => (
  <div>
    <h3>About</h3>
  </div>
);

const Body = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: ${props => props.theme.bg.wash};
`;

class Routes extends Component {
  render() {
    return (
      <Router history={createBrowserHistory()}>
        <Body>
          {/* Global navigation, notifications, message notifications, etc */}
          <Route component={Navbar} />

          {/*
            Switch only renders the first match. Subrouting happens downstream
            https://reacttraining.com/react-router/web/api/Switch
          */}
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/dashboard" component={Dashboard} />

            {/* Public Business Pages */}
            <Route path="/about" component={About} />
            <Route path="/contact" component={About} />
            <Route path="/terms" component={About} />
            <Route path="/code-of-conduct" component={About} />
            <Route path="/style-guide" component={StyleGuide} />

            {/* App Pages */}
            <Route path="/explore" component={Explore} />
            <Route path="/messages" component={DirectMessages} />
            <Route path="/story" component={Story} />
            <Route path="/users" component={UserProfile} />
            <Route path="/notifications" component={Notifications} />

            {/*
              We check communitySlug last to ensure none of the above routes
              pass. We handle null communitySlug values downstream by either
              redirecting to home or showing a 404
            */}
            <Route
              path="/:communitySlug/:frequencySlug"
              component={FrequencyProfile}
            />
            <Route path="/:communitySlug" component={CommunityProfile} />
          </Switch>

        </Body>
      </Router>
    );
  }
}

export default Routes;
