// import our components
import React, { Component } from 'react';
import App from './app';
import { theme } from './containers/ui';
// ...

// set up the store

class Routes extends Component {
  componentDidMount = () => {
    // handle onboarding state
    // handle username creation
    // handle websockets and listeners
  };

  componentWillUnmount = () => {
    // close websockets and listeners
  };

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router
            history={browserHistory}
            render={applyRouterMiddleware(useScroll())}
          >
            <Route path="/" component={App}>
              <Route path="explore" component={Explore} />

              <Route path="messages" component={Messages}>
                <Route path="/messages/new" component={DirectMessageComposer} />
                <Route
                  path="messages/:thread"
                  component={DirectMessageThread}
                />
              </Route>

              <Route path="story/new" component={StoryComposer} />
              <Route path="story/:id" component={Story} />

              <Route path=":communityId" component={Community} />
              <Route path=":communityId/:frequencyId" component={Frequency} />

              <Route path="*" component={FourOhFour} />
            </Route>
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default Routes;
