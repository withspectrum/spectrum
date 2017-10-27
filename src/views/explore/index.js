import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import generateMetaInfo from 'shared/generate-meta-info';
import Titlebar from '../titlebar';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import { Column } from '../../components/column';
import Goop from '../../components/goop';
import { FeaturedCommunity } from '../../components/curation';
import TopCommunityList from './components/topCommunities';
import Search from './components/search';
import { UpsellCreateCommunity, UpsellSignIn } from '../../components/upsell';
import {
  Wrapper,
  ViewHeader,
  Section,
  SectionWrapper,
  SectionTitle,
  Constellations,
} from './style';

import { CommunitySearch } from './view';

import { getCommunity } from './queries';

const Feature = compose(getCommunity)(FeaturedCommunity);

const ExplorePure = props => {
  const { title, description } = generateMetaInfo({
    type: 'explore',
  });

  // previous features include: Vectors, Frontend Cafe, Abstract, Work in Progress, Mental Health
  const featureSlug = 'crypto';
  const featureNotes = `Crypto is a place to discuss crypto-currencies and tokens. As blockchain technology becomes more and more mainstream, communities like Crypto allow more people to get involved, learn, and share what they know. We're all for that, so if you're an existing investor, a newcomer to crypto-currencies, or just interested in learning about blockchain, check out Crypto!`;

  return (
    <AppViewWrapper>
      <Wrapper>
        <Head title={title} description={description} />
        <Titlebar title={'Explore'} noComposer />
        <CommunitySearch
          currentUser={props.currentUser}
          redirectPath={window.location}
        >
          <Search />
        </CommunitySearch>
        <Section>
          <SectionWrapper>
            <Column type="primary">
              <SectionTitle>Most popular communities</SectionTitle>
              <TopCommunityList withMeta={true} withDescription={false} />
            </Column>
          </SectionWrapper>
        </Section>
      </Wrapper>
    </AppViewWrapper>
  );
};

const Explore = compose()(ExplorePure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Explore);
