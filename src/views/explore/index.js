// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import generateMetaInfo from 'shared/generate-meta-info';
import Titlebar from '../titlebar';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import Search from './components/search';
import CommunitySearchWrapper from './components/communitySearchWrapper';
import { Wrapper } from './style';
import { Charts } from './view';
import { track, events } from 'src/helpers/analytics';

type Props = {
  currentUser?: Object,
};

class Explore extends React.Component<Props> {
  componentDidMount() {
    track(events.EXPLORE_VIEWED);
  }

  render() {
    const { title, description } = generateMetaInfo({
      type: 'explore',
    });

    // previous features include: Vectors, Frontend Cafe, Abstract, Work in Progress, Mental Health
    // const featureSlug = 'crypto';
    // const featureNotes = `Crypto is a place to discuss crypto-currencies and tokens. As blockchain technology becomes more and more mainstream, communities like Crypto allow more people to get involved, learn, and share what they know. We're all for that, so if you're an existing investor, a newcomer to crypto-currencies, or just interested in learning about blockchain, check out Crypto!`;

    return (
      <AppViewWrapper>
        <Wrapper data-cy="explore-page" id="main">
          <Head title={title} description={description} />
          <Titlebar title={'Explore'} noComposer />
          <CommunitySearchWrapper
            currentUser={this.props.currentUser}
            redirectPath={window.location}
          >
            <Search />
          </CommunitySearchWrapper>
          <Charts />
        </Wrapper>
      </AppViewWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map)
)(Explore);
