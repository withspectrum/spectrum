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
  ViewContainer,
  ViewHeader,
  Section,
  SectionWrapper,
  SectionTitle,
  Constellations,
} from './style';

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
      <ViewContainer>
        <Head title={title} description={description} />
        <Titlebar title={'Explore'} noComposer />
        <ViewHeader>
          <Feature slug={featureSlug} notes={featureNotes} />
          <Constellations />
          <Goop goop={5} color={'bg.wash'} />
        </ViewHeader>
        <Section>
          <SectionWrapper>
            <Column type="primary">
              <SectionTitle>Search for communities</SectionTitle>
              <Search />

              <SectionTitle>Most popular communities</SectionTitle>
              <TopCommunityList withMeta={true} withDescription={false} />

              {props.currentUser ? (
                <UpsellCreateCommunity />
              ) : (
                <UpsellSignIn redirectPath={window.location} />
              )}
            </Column>
          </SectionWrapper>
        </Section>
      </ViewContainer>
    </AppViewWrapper>
  );
};

const Explore = compose()(ExplorePure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Explore);
