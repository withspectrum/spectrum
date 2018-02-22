import React, { Component } from 'react';
import { track } from '../../helpers/events';
import { FeatureUpsell, Sell, PageFooter, Plans } from './view';
import { Wrapper } from './style';

class Pricing extends Component {
  componentDidMount() {
    track('pricing', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-e2e-id="pricing-page">
        <FeatureUpsell />
        <Plans />
        <Sell />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Pricing;
