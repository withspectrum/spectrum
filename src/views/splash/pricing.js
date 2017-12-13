import React, { Component } from 'react';
import { track } from '../../helpers/events';
import { storeItem, getItemFromStorage } from '../../helpers/localStorage';
import {
  Overview,
  Centralized,
  CommunitySearch,
  Sell,
  Plans,
  PageFooter,
} from './view';
import { Wrapper } from './style';

class Pricing extends Component {
  componentDidMount() {
    track('pricing', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-e2e-id="pricing-page">
        <Plans />
        <Sell />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Pricing;
