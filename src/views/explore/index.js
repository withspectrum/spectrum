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
  const featureSlug = 'wip';
  const featureNotes = `Work In Progress is a community where people can show what they're working on, get feedback, and find help in a friendly, constructive setting. Creating this kind of space was a goal from the very beginning of our work on Spectrum and we're super excited to see others creating this kind of community to share with others!`;

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

              {props.currentUser ? <UpsellCreateCommunity /> : <UpsellSignIn />}
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
