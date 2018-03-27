// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import PageFooter from '../components/footer';
import Nav from '../components/nav';
import { Wrapper } from '../style';
import Paid from './components/paid';
import Intro from './components/intro';
import Discount from './components/discount';
import CommunityList from './components/communityList';
import Link from 'src/components/link';
import {
  ContentContainer,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  SectionDescription,
  Subsection,
  Highlight,
  Divider,
  TableCardButton,
} from './style';
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
    const { ownsCommunities } = this.state;

    return (
      <Wrapper data-cy="pricing-page">
        <Intro />
        <Paid />
        <Discount />
        <CommunityList
          setOwnsCommunities={this.setOwnsCommunities}
          ref={component => (this.ownedCommunitiesSection = component)}
        />
        <PageFooter />
      </Wrapper>
    );
  }
}
export default Pricing;
