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
import Titlebar from '../titlebar';
import AppViewWrapper from '../../components/appViewWrapper';
import { Loading } from '../../components/loading';
import { GoopyThree } from '../../views/homepage/style';
import { FlexCol } from '../../components/globals';
import {
  // ScrollBody,
  ViewHeader,
  ViewTitle,
  ViewSubtitle,
  Section,
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
  getChannel,
  getCommunity,
  getTopChannels,
  getUserSubscriptions,
} from './queries';

const CURATED_CHANNELS = {
  title: '5 cool ways to use channels',
  subtitle: 'News, journaling, communities, show and tell, and recommendations...',
  items: [
    { id: '32ebce3d-0c9b-4b94-9ddf-e7cd40ec6ffb', type: 'channel' },
    { id: '06c877e9-b872-42ef-9416-aa1d465888df', type: 'channel' },
    { id: '0352f4f5-8e12-4de8-8299-9a6664f77ee0', type: 'channel' },
    { id: '16bf0f80-0335-4fbb-8d4d-ccfe5c8c8162', type: 'channel' },
    { id: '03426243-2c9c-4f99-bc77-867e37f8e4e3', type: 'channel' },
  ],
};

const CURATED_COMMUNITIES = {
  title: 'Community Center',
  subtitle: 'Join some new communities and discover new things!',
  items: [
    { id: '0af28a04-f4ef-4294-b617-da9b37a88d3a', type: 'community' },
    { id: 'e44b03c9-be93-463b-ae5b-08173cb4010c', type: 'community' },
    { id: 'fbb87abe-2735-4630-92f5-674b6f5dcbb9', type: 'community' },
    { id: '77f5720c-cc39-4486-9766-ac0f1c8c1334', type: 'community' },
    { id: 'a4338203-2938-425e-a7f8-992c58e3492b', type: 'community' },
  ],
};

const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

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

const Channel = ({ data: { channel, ids } }) => {
  if (!channel) {
    return <div />;
  }
  return (
    <Item key={channel.id}>
      <FlexCol>
        <ItemTitle>~ {channel.name}</ItemTitle>
        <ItemMeta>{channel.community.name}</ItemMeta>
        <ItemCopy>{channel.description}</ItemCopy>
      </FlexCol>
      <ButtonContainer>
        {ids && ids.indexOf(channel.id) > -1
          ? <Link to={`/${channel.slug}`}>
              <ItemButton joined>{`Go to ~${channel.name}`}</ItemButton>
            </Link>
          : <ItemButton>Join</ItemButton>}
      </ButtonContainer>
    </Item>
  );
};

const Community = ({ data: { community, ids } }) => {
  if (!community) {
    return <div />;
  }

  return (
    <Item key={community.id}>
      <FlexCol>
        <ItemTitle>{community.name}</ItemTitle>
        <ItemMeta>{community.metaData.members} members</ItemMeta>
      </FlexCol>
      <ButtonContainer>
        {ids && ids.indexOf(community.id) > -1
          ? <Link to={`/${community.slug}`}>
              <ItemButton joined>{`Go to ${community.name}`}</ItemButton>
            </Link>
          : <ItemButton>Join</ItemButton>}
      </ButtonContainer>
    </Item>
  );
};

const composeSectionFromList = (list, ids) => {
  return (
    <Section>
      <SectionTitle>{list.title}</SectionTitle>
      <SectionSubtitle>{list.subtitle}</SectionSubtitle>
      <Row>
        {list.items.map(entity => {
          if (entity.type === 'channel') {
            const EntityWithData = compose(
              withProps({ id: entity.id, key: entity.id, ids }),
              getChannel,
              displayLoadingState
            )(Channel);

            return EntityWithData();
          } else if (entity.type === 'community') {
            const EntityWithData = compose(
              withProps({ id: entity.id, key: entity.id, ids }),
              getCommunity,
              displayLoadingState
            )(Community);

            return EntityWithData();
          } else {
            return <div />;
          }
        })}
      </Row>
    </Section>
  );
};

const TopThirtyPure = ({ data: { topChannels, error } }, i) => {
  if (error) {
    return (
      <Section>
        <ErrorItem />
      </Section>
    );
  }
  return (
    <Section>
      <SectionTitle>Best of Beta</SectionTitle>
      <SectionSubtitle>
        The 30 most-popular pre-launch channels
      </SectionSubtitle>
      <Row>
        {topChannels.map(channel => {
          return Channel({ data: { channel: channel } });
        })}
      </Row>
    </Section>
  );
};

const TopThirty = compose(getTopChannels, displayLoadingState)(TopThirtyPure);

const ExplorePure = props => {
  const { data, currentUser } = props;
  if (data.loading) {
    return (
      <AppViewWrapper>
        <Titlebar title={'Explore'} />
        <ViewHeader>
          <ViewTitle>Explore</ViewTitle>
          <ViewSubtitle>
            Discover more of what Spectrum has to offer!
          </ViewSubtitle>
          <Constellations />
          <GoopyThree />
        </ViewHeader>
      </AppViewWrapper>
    );
  }

  if (data.error) {
    console.log(props);
    return <ErrorItem />;
  }

  const communityIds = currentUser
    ? data.user.communityConnection.edges.map(community => {
        return community.node.id;
      })
    : [];

  const channelIds = currentUser
    ? data.user.channelConnection.edges.map(channel => {
        return channel.node.id;
      })
    : [];

  return (
    <AppViewWrapper>
      {console.log(props)}
      <Titlebar title={'Explore'} />
      {/* <ViewHeader>
        <ViewTitle>Explore</ViewTitle>
        <ViewSubtitle>
          Discover more of what Spectrum has to offer!
        </ViewSubtitle>
        <Constellations />
        <GoopyThree />
      </ViewHeader>
      <TopThirty /> */}
      {/* {composeSectionFromList(CURATED_CHANNELS, channelIds)} */}
      {/* {composeSectionFromList(CURATED_COMMUNITIES, communityIds)} */}
    </AppViewWrapper>
  );
};

const Explore = compose(getUserSubscriptions, pure)(ExplorePure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Explore);
