import React, { Component } from 'react';
import { track } from '../../helpers/events';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import { ContactInfo, Plans, PageFooter } from './view';
import { Wrapper } from './style';

class Support extends Component {
  state: {
    preferredSigninMethod: string,
  };

  constructor() {
    super();

    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    this.state = {
      preferredSigninMethod,
    };
  }

  componentDidMount() {
    track('support', 'viewed', null);
  }

  trackSignin = (type, method) => {
    track('support', 'logged in', type);
    storeItem('preferred_signin_method', method);
  };

  render() {
    return (
      <Wrapper data-e2e-id="support-page">
        <ContactInfo />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
