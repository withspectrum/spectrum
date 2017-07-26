//@flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import generateMetaInfo from 'shared/generate-meta-info';
import Titlebar from '../titlebar';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import { Column } from '../../components/column';
import { GoopyThree } from '../../views/homepage/style';
import { FeaturedCommunity } from '../../components/curation';
import TopCommunityList from './components/topCommunities';
import Search from './components/search';
import RecentCommunityList from './components/recentCommunities';
import { UpsellCreateCommunity } from '../../components/upsell';
import {
  ViewContainer,
  ViewHeader,
  Section,
  SectionWrapper,
  SectionWithGradientTransition,
  SectionTitle,
  Constellations,
} from './style';

import { getCommunity } from './queries';

const Feature = compose(getCommunity, pure)(FeaturedCommunity);

const ExplorePure = props => {
  const { title, description } = generateMetaInfo({
    type: 'explore',
  });
  const featureSlug = 'frontend';
  const featureNotes = `Frontend Cafe is a community for sharing your favorite resources for frontend engineering. It's been super active since its inception last week and we think news aggregation a really interesting use of Spectrum. Check it out and share your favorite resources!`;

  return (
    <AppViewWrapper>
      <ViewContainer>
        <Head title={title} description={description} />
        <Titlebar title={'Explore'} noComposer />
        <ViewHeader>
          <Feature slug={featureSlug} notes={featureNotes} />
          <Constellations />
          <GoopyThree />
        </ViewHeader>
        <SectionWithGradientTransition />
        <Section>
          <SectionWrapper>
            <Column type="primary">
              <SectionTitle>Search for communities</SectionTitle>
              <Search />

              <SectionTitle>Most popular communities</SectionTitle>
              <TopCommunityList withMeta={true} withDescription={false} />

              <UpsellCreateCommunity />
            </Column>
          </SectionWrapper>
        </Section>
      </ViewContainer>
    </AppViewWrapper>
  );
};

const Explore = compose(pure)(ExplorePure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Explore);
