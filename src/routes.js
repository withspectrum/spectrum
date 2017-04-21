// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Router, Route, Switch } from 'react-router';
//$FlowFixMe
import styled from 'styled-components';
//$FlowFixMe
import createBrowserHistory from 'history/createBrowserHistory';
import DirectMessages from './containers/directMessages';
import Explore from './containers/explore';
import Story from './containers/story';
import UserProfile from './containers/userProfile';
import Navbar from './containers/navbar';

const Home = () => (
  <div>
    <h3>Home</h3>
  </div>
);

const About = () => (
  <div>
    <h3>About</h3>
  </div>
);

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.bg.wash};
`;

class Routes extends Component {
  render() {
    return (
      <Router history={createBrowserHistory()}>
        <Body>
          {/* Global navigation, notifications, message notifications, etc */}
          <Navbar />

          {/*
            Switch only renders the first match. Subrouting happens downstream
            https://reacttraining.com/react-router/web/api/Switch
          */}
          <Switch>
            <Route exact path="/" component={Home} />

            {/* Public Business Pages */}
            <Route path="/about" component={About} />
            <Route path="/contact" component={About} />
            <Route path="/terms" component={About} />
            <Route path="/code-of-conduct" component={About} />

            {/* App Pages */}
            <Route path="/explore" component={Explore} />
            <Route path="/messages" component={DirectMessages} />
            <Route path="/story" component={Story} />
            <Route path="/users" component={UserProfile} />

            {/*
              We check communityId last to ensure none of the above routes
              pass. We handle null communityId values downstream by either
              redirecting to home or showing a 404
            */}
            <Route path="/:communityId" component={About} />
          </Switch>
        </Body>
      </Router>
    );
  }
}

export default Routes;
