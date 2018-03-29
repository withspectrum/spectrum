// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import Paid from './components/paid';
import Intro from './components/intro';
import Discount from './components/discount';
import Faq from './components/faq';
import type { ContextRouter } from 'react-router';

type Props = {
  ...$Exact<ContextRouter>,
};

type State = {
  ownsCommunities: boolean,
};

class Pricing extends React.Component<Props, State> {
  state = { ownsCommunities: false };

  componentDidMount() {
    track('pricing', 'viewed', null);
  }

  setOwnsCommunities = () => {
    return this.setState({
      ownsCommunities: true,
    });
  };

  render() {
    return (
      <Wrapper data-cy="pricing-page">
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
