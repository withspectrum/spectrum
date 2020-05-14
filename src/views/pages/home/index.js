// @flow
import * as React from 'react';
import { storeItem, getItemFromStorage } from 'src/helpers/localStorage';
import { Overview, Centralized, CommunitySearch, Chat, Yours } from '../view';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';

type State = {
  preferredSigninMethod: string,
};

class Splash extends React.Component<{}, State> {
  constructor() {
    super();

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    this.state = {
      preferredSigninMethod,
    };
  }

  trackSignin = (type: string, method: string) => {
    storeItem('preferred_signin_method', method);
  };

  render() {
    return (
      <Wrapper data-cy="home-page">
        <Overview />
        <Centralized />
        <CommunitySearch />
        <Chat />
        <Yours />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Splash;
