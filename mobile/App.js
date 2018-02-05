// @flow
import Sentry from 'sentry-expo';
import React from 'react';
import { SecureStore, AppLoading } from 'expo';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';

import theme from './components/theme';
import { client, createLink } from '../shared/graphql';
import TabBar from './views/TabBar';
import reducers from './reducers';
import { authenticate } from './actions/authentication';

let sentry = Sentry.config(
  'https://3bd8523edd5d43d7998f9b85562d6924@sentry.io/154812'
);

// Need to guard this for HMR to work
if (sentry && sentry.install) sentry.install();

const store = createStore(reducers);

type State = {
  authLoaded: ?boolean,
  token: ?string,
  client: typeof client,
};

class App extends React.Component<{}, State> {
  state = {
    authLoaded: null,
    token: null,
    client,
  };

  componentDidMount = async () => {
    // Subscribe to Redux state changes
    store.subscribe(this.listen);

    let token;
    try {
      token = await SecureStore.getItemAsync('token');
    } catch (err) {
      // TODO: Sentry
      console.log(err);
      this.setState({
        authLoaded: true,
      });
    }

    store.dispatch(authenticate(token));
    this.setState({
      authLoaded: true,
      token,
    });
  };

  listen = () => {
    const { authentication } = store.getState();
    const { token, client } = this.state;
    if (authentication.token !== this.state.token) {
      // Override the client.link to pass the Authorization header
      client.link = createLink({
        httpClientOptions: {
          headers: {
            authorization:
              typeof authentication.token === 'string'
                ? `Bearer ${authentication.token}`
                : null,
          },
        },
      });
      this.setState({
        token: authentication.token,
        client: client,
      });
    }
  };

  render() {
    if (!this.state.authLoaded) {
      return <AppLoading />;
    }

    const { client } = this.state;

    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <TabBar />
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    );
  }
}

export default App;
