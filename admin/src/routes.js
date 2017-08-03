// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Router, Route, Switch } from 'react-router';
//$FlowFixMe
import styled from 'styled-components';
import { history } from './helpers/history';
import ScrollManager from './components/scrollManager';
import ModalRoot from './components/modals/modalRoot';
import Toasts from './components/toasts';
import Users from './views/users';
import Communities from './views/communities';
import Navbar from './views/navbar';
import Dashboard from './views/dashboard';

const Body = styled.div`
  display: flex;
  flex-direction: column;
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
    return (
      <Router history={history}>
        <ScrollManager>
          <Body>
            {/* Global navigation, notifications, message notifications, etc */}
            <Route component={Navbar} />
            <Route component={ModalRoot} />
            <Route component={Toasts} />

            {/*
              Switch only renders the first match. Subrouting happens downstream
              https://reacttraining.com/react-router/web/api/Switch
            */}
            <Switch>
              <Route exact path="/" component={Dashboard} />

              {/* App Pages */}
              <Route path="/users/:username" component={Users} />
              <Route path="/users" component={Users} />
              <Route path="/communities/:slug" component={Communities} />
              <Route path="/communities" component={Communities} />
            </Switch>
          </Body>
        </ScrollManager>
      </Router>
    );
  }
}

export default Routes;
