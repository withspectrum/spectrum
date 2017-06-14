//@flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import generateMetaInfo from '../../../server/shared/generate-meta-info';
import Titlebar from '../titlebar';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import { Column } from '../../components/column';
import { GoopyThree } from '../../views/homepage/style';
import { FeaturedCommunity } from '../../components/curation';
import TopCommunityList from './components/topCommunities';
import RecentCommunityList from './components/recentCommunities';
import {
  ViewContainer,
  ViewHeader,
  Section,
  SectionWrapper,
  SectionWithGradientTransition,
  SectionTitle,
  Constellations,
} from './style';

import {
  getCommunity,
  // getTopChannels,
  // getUserCommunities,
} from './queries';

const Feature = compose(getCommunity, pure)(FeaturedCommunity);

const ExplorePure = props => {
  const { title, description } = generateMetaInfo({
    type: 'explore',
  });
  const featureSlug = 'ruecker-group';
  const featureNotes =
    'Vectors is a project focused on exposing people to more perspectives. Although primarily tech-oriented, the goals of this conference are very much inline with our goals here on Spectrum - encouraging diversity and constructive conversation in a forum where people can feel safe.';

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
              <SectionTitle>Most popular communities</SectionTitle>
              <TopCommunityList withMeta={true} withDescription={false} />
            </Column>
            <Column type="primary">
              <SectionTitle>Most recent communities</SectionTitle>
              <RecentCommunityList withMeta={true} withDescription={false} />
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
