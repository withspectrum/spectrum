//@flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import withProps from 'recompose/withProps';
import generateMetaInfo from '../../../server/shared/generate-meta-info';
import Titlebar from '../titlebar';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import { Column } from '../../components/column';
import { Loading } from '../../components/loading';
import { GoopyThree } from '../../views/homepage/style';
import { FlexCol, FlexRow } from '../../components/globals';
import { FeaturedCommunity } from '../../components/curation';
import TopCommunityList from './components/topCommunities';
import RecentCommunityList from './components/recentCommunities';
import {
  // ScrollBody,
  ViewContainer,
  ViewHeader,
  ViewTitle,
  ViewSubtitle,
  Section,
  SectionWrapper,
  SectionWithGradientTransition,
  SectionTitle,
  SectionSubtitle,
  Row,
  Item,
  ItemTitle,
  ItemMeta,
  ItemCopy,
  ButtonContainer,
  ItemButton,
  Constellations,
  ErrorState,
} from './style';

import {
  getCommunity,
  // getTopChannels,
  // getUserCommunities,
} from './queries';

const Feature = compose(getCommunity, pure)(FeaturedCommunity);

const ErrorItem = () => {
  return (
    <ErrorState>
      <FlexCol>
        <ItemTitle>Whoops...</ItemTitle>
        <ItemCopy>The server disconnected. Please refresh the page.</ItemCopy>
      </FlexCol>
      <ButtonContainer center>
        <ItemButton onClick={() => location.reload()}>Refresh</ItemButton>
      </ButtonContainer>
    </ErrorState>
  );
};

const ExplorePure = props => {
  const { data, currentUser } = props;

  const { title, description } = generateMetaInfo({
    type: 'explore',
  });
  const featureSlug = 'vectors';
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
