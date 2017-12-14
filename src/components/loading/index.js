// @flow
import React from 'react';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
// $FlowFixMe
import styled from 'styled-components';
import { Spinner, FlexCol } from '../globals';
import Grid from '../grid';
import { Card } from '../card';
import { Column } from '../column';
import { ThreadViewContainer, Detail, Content } from '../../views/thread/style';
import {
  LoadingScreenContainer,
  ShimmerList,
  ShimmerListLite,
  ShimmerInboxThread,
  ShimmerThread,
  ShimmerThreadDetail,
  ShimmerProfile,
  ShimmerProfileLite,
  ShimmerListItem,
  ShimmerDM,
  ShimmerBubble,
  ShimmerChat,
  ShimmerInboxComposer,
  ShimmerComposer,
  ShimmerBase,
  ShimmerLine,
  ShimmerSelect,
  Cover,
  LoadingOverlay,
  LoadingNavbarContainer,
  LogoLink,
  Logo,
} from './style';

/*
  Creates a container that fills the width and height of its parent
  and absolutely centers a loading spinner inside.

  Loading spinner takes a size and color.
*/
const LoadingContainer = styled.div`
  display: flex;
  flex: auto;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LoadingCardContainer = styled(Card)`
  flex: 1 1 auto;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
`;

/*
  Outputs a spinner only with a transparent background that will fill to the width
  and height of its parent. Useful for inline spinners.
*/
export const Loading = ({
  size,
  color,
}: {
  size?: number,
  color?: string,
}): React$Element<any> => (
  <LoadingContainer>
    <Spinner size={size} color={color} />
  </LoadingContainer>
);

/*
  Outputs a spinner on top of a card. The card will fill the size of its parent.
  Useful for adding loading states to threads, profile components, the composer,
  etc
*/
export const LoadingCard = ({
  size,
  color,
}: {
  size?: Number,
  color?: String,
}): React$Element<any> => (
  <LoadingCardContainer>
    <Spinner size={size} color={color} />
  </LoadingCardContainer>
);

export const LoadingGallery = (): React$Element<any> => (
  <LoadingOverlay>
    <Spinner size={'32'} color={'bg.default'} />
  </LoadingOverlay>
);

export const LoadingNavbar = (): React$Element<any> => (
  <LoadingNavbarContainer>
    <LogoLink to="/">
      <Logo src="/img/mark-white.png" role="presentation" />
    </LogoLink>
    <LoadingContainer>
      <Spinner size={'20'} color={'bg.default'} />
    </LoadingContainer>
  </LoadingNavbarContainer>
);

export const LoadingThread = () => (
  <ShimmerThread>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '0',
          height: '4px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '16px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '4px',
          left: '120px',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '24px',
          left: '0',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '60px',
          left: '0',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '24px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '52px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '80px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '108px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '136px',
          height: '24px',
          width: '100%',
        }}
      />
    </ShimmerBase>
  </ShimmerThread>
);

export const LoadingInboxThread = () => (
  <ShimmerInboxThread>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '0',
          height: '4px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '16px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '4px',
          left: '120px',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '24px',
          left: '0',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '60px',
          left: '0',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '24px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '52px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '80px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '108px',
          height: '24px',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '136px',
          height: '24px',
          width: '100%',
        }}
      />
    </ShimmerBase>
  </ShimmerInboxThread>
);

export const LoadingFeed = () => (
  <FlexCol>
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
    <LoadingThread />
  </FlexCol>
);

export const LoadingBubble = () => (
  <ShimmerBubble>
    <ShimmerBase>
      <ShimmerLine />
    </ShimmerBase>
  </ShimmerBubble>
);

export const LoadingChat = ({ size }: { size?: 'small' }) => (
  <ShimmerChat>
    <LoadingBubble />
    <LoadingBubble />
    <LoadingBubble />
    {size !== 'small' && <LoadingBubble />}
    {size !== 'small' && <LoadingBubble />}
    {size !== 'small' && <LoadingBubble />}
    {size !== 'small' && <LoadingBubble />}
    {size !== 'small' && <LoadingBubble />}
    {size !== 'small' && <LoadingBubble />}
    {size !== 'small' && <LoadingBubble />}
  </ShimmerChat>
);

export const LoadingThreadDetail = () => (
  <ShimmerThreadDetail>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '40px',
          height: '40px',
          width: '12px',
        }}
      />
      <Cover
        style={{
          top: '40px',
          left: '0',
          height: '24px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '20px',
          left: '40px',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '0',
          height: '20px',
          width: 'calc(100% - 240px)',
        }}
      />
      <Cover
        style={{
          top: '28px',
          right: '0',
          height: '12px',
          width: 'calc(100% - 200px)',
        }}
      />
      <Cover
        style={{
          top: '64px',
          right: '0',
          height: '40px',
          width: '20%',
        }}
      />
      <Cover
        style={{
          top: '104px',
          left: '0',
          height: '24px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '148px',
          left: '0',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '128px',
          right: '0',
          height: '20px',
          width: '48px',
        }}
      />
      <Cover
        style={{
          top: '176px',
          left: '0',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '184px',
          right: '0',
          height: '20px',
          width: '24px',
        }}
      />
      <Cover
        style={{
          top: '204px',
          left: '0',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '212px',
          right: '0',
          height: '20px',
          width: '80%',
        }}
      />
      <Cover
        style={{
          top: '232px',
          left: '0',
          height: '28px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '280px',
          left: '0',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '288px',
          right: '0',
          height: '20px',
          width: '40%',
        }}
      />
    </ShimmerBase>
  </ShimmerThreadDetail>
);

export const LoadingListItem = () => (
  <ShimmerListItem>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '16px',
          left: '40px',
          height: '8px',
          width: 'calc(100% - 72px)',
        }}
      />
      <Cover
        style={{
          top: '0',
          left: '32px',
          height: '32px',
          width: '12px',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '32px',
          height: '20px',
          width: '96px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          right: '26px',
          height: '32px',
          width: '64px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          right: '0',
          height: '32px',
          width: '2px',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '0',
          height: '4px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          right: '0',
          height: '4px',
          width: '32px',
        }}
      />
    </ShimmerBase>
  </ShimmerListItem>
);

export const LoadingListItemLite = () => (
  <ShimmerListItem>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '10px',
          left: '0px',
          height: '14px',
          width: 'calc(100% - 72px)',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '32px',
          height: '20px',
          width: '96px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          right: '26px',
          height: '32px',
          width: '64px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          right: '0',
          height: '32px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '0',
          height: '4px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          right: '0',
          height: '4px',
          width: '32px',
        }}
      />
    </ShimmerBase>
  </ShimmerListItem>
);

export const LoadingList = () => (
  <ShimmerList>
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
    <LoadingListItem />
  </ShimmerList>
);

export const LoadingListThreadDetail = () => (
  <ShimmerListLite>
    <LoadingListItemLite />
    <LoadingListItemLite />
    <LoadingListItemLite />
    <LoadingListItemLite />
    <LoadingListItemLite />
  </ShimmerListLite>
);

export const LoadingDM = () => (
  <ShimmerDM>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '40px',
          height: '4px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '20px',
          left: '40px',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '0',
          left: '40px',
          height: '40px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          top: '40px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '64px',
          height: '20px',
          width: '8px',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '0px',
          height: '8px',
          width: '64px',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '0px',
          height: '20px',
          width: '16px',
        }}
      />
    </ShimmerBase>
  </ShimmerDM>
);

export const LoadingComposer = () => (
  <ShimmerComposer>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '28px',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '8px',
          left: '28px',
          height: '16px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          top: '8px',
          right: '0',
          height: '16px',
          width: '30%',
        }}
      />
      <Cover
        style={{
          top: '0px',
          left: '0px',
          height: '4px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          top: '0px',
          left: '0px',
          height: '100%',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '8px',
          left: '8px',
          height: '16px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          bottom: '0px',
          left: '0px',
          height: '4px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          left: '28px',
          height: '12px',
          width: '100%',
        }}
      />
    </ShimmerBase>
  </ShimmerComposer>
);

export const LoadingInboxComposer = () => (
  <ShimmerInboxComposer>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '28px',
          height: '12px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '8px',
          left: '28px',
          height: '16px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          top: '8px',
          right: '0',
          height: '16px',
          width: '30%',
        }}
      />
      <Cover
        style={{
          top: '0px',
          left: '0px',
          height: '4px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          top: '0px',
          left: '0px',
          height: '100%',
          width: '4px',
        }}
      />
      <Cover
        style={{
          top: '8px',
          left: '8px',
          height: '16px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          bottom: '0px',
          left: '0px',
          height: '4px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          left: '28px',
          height: '12px',
          width: '100%',
        }}
      />
    </ShimmerBase>
  </ShimmerInboxComposer>
);

export const LoadingProfile = () => (
  <ShimmerProfile>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '40px',
          height: '10px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '24px',
          left: '40px',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '10px',
          left: '40px',
          height: '18px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          top: '40px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '64px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '88px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '48px',
          right: '0',
          height: '16px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          right: '0',
          height: '16px',
          width: '64px',
        }}
      />
    </ShimmerBase>
  </ShimmerProfile>
);

export const LoadingProfileThreadDetail = () => (
  <ShimmerProfileLite>
    <ShimmerBase>
      <ShimmerLine />
      <Cover
        style={{
          top: '0',
          left: '0',
          height: '48px',
          width: 'calc(50% - 20px)',
        }}
      />
      <Cover
        style={{
          top: '0',
          right: '0',
          height: '48px',
          width: 'calc(50% - 20px)',
        }}
      />
      <Cover
        style={{
          top: '40px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '64px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '88px',
          left: '0',
          height: '16px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '48px',
          right: '0',
          height: '16px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          top: '48px',
          left: '0',
          height: '16px',
          width: '32px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          right: '0',
          height: '16px',
          width: '64px',
        }}
      />
      <Cover
        style={{
          top: '72px',
          left: '0',
          height: '16px',
          width: '64px',
        }}
      />
    </ShimmerBase>
  </ShimmerProfileLite>
);

export const LoadingProfileGrid = () => (
  <Grid>
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
    <LoadingProfile />
  </Grid>
);

export const LoadingSelect = () => (
  <ShimmerSelect>
    <ShimmerBase />
  </ShimmerSelect>
);

export const LoadingScreen = (): React$Element<any> => (
  <LoadingScreenContainer>
    <Column hideOnMobile type="secondary">
      <LoadingProfile />
      <LoadingList />
    </Column>

    <Column type="primary" alignItems="center">
      <LoadingComposer />
      <LoadingFeed />
    </Column>
  </LoadingScreenContainer>
);

export const LoadingThreadView = (): React$Element<any> => (
  <ThreadViewContainer>
    <Content>
      <Detail type="only">
        <LoadingThreadDetail />
        <LoadingChat />
      </Detail>
    </Content>
  </ThreadViewContainer>
);

export const LoadingNotifications = (): React$Element<any> => (
  <LoadingScreenContainer>
    <Column type="primary" alignItems="center">
      <LoadingFeed />
    </Column>
  </LoadingScreenContainer>
);

export const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

export const displayLoadingGallery = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingGallery)
);

export const displayLoadingNavbar = branch(
  props =>
    !props.data ||
    props.data.loading ||
    !props.notificationsQuery ||
    props.notificationsQuery.loading,
  renderComponent(LoadingNavbar)
);

export const displayLoadingCard = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingCard)
);

export const displayLoadingScreen = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingScreen)
);

export const displayLoadingThreadView = branch(
  props => !props.data,
  renderComponent(LoadingThreadView)
);

export const displayLoadingNotifications = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingNotifications)
);

export const displayLoadingComposer = branch(
  props => !props.data.user && !props.data.error,
  renderComponent(LoadingComposer)
);
