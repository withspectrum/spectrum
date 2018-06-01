// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import Paid from './components/paid';
import Intro from './components/intro';
import Discount from './components/discount';
import Faq from './components/faq';
import type { ContextRouter } from 'react-router';
import { track, events } from 'src/helpers/analytics';
import Head from 'src/components/head';

type Props = {
  ...$Exact<ContextRouter>,
};

type State = {
  ownsCommunities: boolean,
};

class Pricing extends React.Component<Props, State> {
  state = { ownsCommunities: false };

  componentDidMount() {
    track(events.PRICING_PAGE_VIEWED);
  }

  render() {
    return (
      <Wrapper data-cy="pricing-page">
        <Head
          title={'Spectrum · Pricing'}
          description={'Pricing built with your community in mind'}
        />

        <Intro />
        <Paid />
        <Discount />
        <Faq />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Pricing;
