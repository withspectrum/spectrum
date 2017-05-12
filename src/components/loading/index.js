// @flow
import React from 'react';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
// $FlowFixMe
import styled from 'styled-components';
import { Spinner } from '../globals';
import { Card } from '../card';
import { Column } from '../column';
import {
  LoadingScreenContainer,
  ShimmerList,
  ShimmerStory,
  ShimmerProfile,
  ShimmerComposer,
  ShimmerBase,
  ShimmerLine,
  Cover,
} from './style';

/*
  Creates a container that fills the width and height of its parent
  and absolutely centers a loading spinner inside.

  Loading spinner takes a size and color.
*/
const LoadingContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LoadingCardContainer = styled(Card)`
  width: 100%;
  height: 100%;
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
  size: Number,
  color: String,
}): React$Element<any> => (
  <LoadingContainer>
    <Spinner size={size} color={color} />
  </LoadingContainer>
);

/*
  Outputs a spinner on top of a card. The card will fill the size of its parent.
  Useful for adding loading states to stories, profile components, the composer,
  etc
*/
export const LoadingCard = ({
  size,
  color,
}: {
  size: Number,
  color: String,
}): React$Element<any> => (
  <LoadingCardContainer>
    <Spinner size={size} color={color} />
  </LoadingCardContainer>
);

/*
  Outputs a full-screen loader with shimmering cards and columns. This is useful
  when an entire view is wrapped in a query and we need certain data (like
  permission checks) before we render anything.
*/
export const LoadingScreen = (): React$Element<any> => (
  <LoadingScreenContainer>
    <Column type="secondary">
      <ShimmerProfile>
        <ShimmerBase>
          <ShimmerLine />
          <Cover
            style={{ top: '0', left: '40px', height: '10px', width: '280px' }}
          />
          <Cover
            style={{
              top: '24px',
              left: '40px',
              height: '16px',
              width: '280px',
            }}
          />
          <Cover
            style={{ top: '10px', left: '40px', height: '18px', width: '16px' }}
          />
          <Cover
            style={{ top: '36px', left: '0', height: '16px', width: '288px' }}
          />
          <Cover
            style={{ top: '58px', left: '0', height: '16px', width: '288px' }}
          />
          <Cover
            style={{ top: '80px', left: '0', height: '16px', width: '288px' }}
          />
          <Cover
            style={{ top: '44px', right: '0', height: '16px', width: '32px' }}
          />
          <Cover
            style={{ top: '64px', right: '0', height: '16px', width: '64px' }}
          />
        </ShimmerBase>
      </ShimmerProfile>
      <ShimmerList>
        <ShimmerBase>
          <ShimmerLine />

          <Cover
            style={{ top: '12px', left: '0', height: '16px', width: '288px' }}
          />
          <Cover
            style={{ top: '36px', left: '0', height: '28px', width: '288px' }}
          />
          <Cover
            style={{ top: '0px', right: '0', height: '16px', width: '32px' }}
          />
          <Cover
            style={{ top: '28px', right: '0', height: '16px', width: '64px' }}
          />

          <Cover
            style={{ top: '76px', left: '0', height: '16px', width: '288px' }}
          />
          <Cover
            style={{ top: '100px', left: '0', height: '32px', width: '288px' }}
          />
          <Cover
            style={{ top: '60px', right: '0', height: '18px', width: '72px' }}
          />
          <Cover
            style={{ top: '92px', right: '0', height: '16px', width: '104px' }}
          />

          <Cover
            style={{ top: '140px', left: '0', height: '16px', width: '288px' }}
          />
          <Cover
            style={{ top: '164px', left: '0', height: '28px', width: '288px' }}
          />
          <Cover
            style={{ top: '126px', right: '0', height: '18px', width: '96px' }}
          />
          <Cover
            style={{ top: '154px', right: '0', height: '16px', width: '32px' }}
          />

        </ShimmerBase>
      </ShimmerList>
    </Column>

    <Column type="primary" alignItems="center">
      <ShimmerComposer>
        <ShimmerBase>
          <ShimmerLine />
        </ShimmerBase>
      </ShimmerComposer>

      <ShimmerStory>
        <ShimmerBase>
          <ShimmerLine />
          <Cover
            style={{ top: '16px', left: '0', height: '16px', width: '528px' }}
          />
          <Cover
            style={{ top: '24px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '44px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '64px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '84px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '0', right: '0', height: '16px', width: '32px' }}
          />
          <Cover
            style={{ top: '32px', right: '0', height: '12px', width: '32px' }}
          />
          <Cover
            style={{ top: '52px', right: '0', height: '12px', width: '96px' }}
          />
          <Cover
            style={{ top: '72px', right: '0', height: '12px', width: '48px' }}
          />
        </ShimmerBase>
      </ShimmerStory>

      <ShimmerStory>
        <ShimmerBase>
          <ShimmerLine />
          <Cover
            style={{
              top: '16px',
              left: '84px',
              height: '16px',
              width: '528px',
            }}
          />
          <Cover
            style={{
              top: '24px',
              left: '84px',
              height: '10px',
              width: '528px',
            }}
          />
          <Cover
            style={{
              top: '44px',
              left: '84px',
              height: '10px',
              width: '528px',
            }}
          />
          <Cover
            style={{
              top: '64px',
              left: '84px',
              height: '10px',
              width: '528px',
            }}
          />
          <Cover
            style={{
              top: '84px',
              left: '84px',
              height: '10px',
              width: '528px',
            }}
          />
          <Cover
            style={{ top: '0px', left: '84px', height: '84px', width: '16px' }}
          />
          <Cover
            style={{ top: '0', right: '0', height: '16px', width: '128px' }}
          />
          <Cover
            style={{ top: '32px', right: '0', height: '12px', width: '32px' }}
          />
          <Cover
            style={{ top: '52px', right: '0', height: '12px', width: '90px' }}
          />
          <Cover
            style={{ top: '72px', right: '0', height: '12px', width: '156px' }}
          />
        </ShimmerBase>
      </ShimmerStory>

      <ShimmerStory>
        <ShimmerBase>
          <ShimmerLine />
          <Cover
            style={{ top: '16px', left: '0', height: '16px', width: '528px' }}
          />
          <Cover
            style={{ top: '24px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '44px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '64px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '84px', left: '0', height: '10px', width: '528px' }}
          />
          <Cover
            style={{ top: '0', right: '0', height: '16px', width: '88px' }}
          />
          <Cover
            style={{ top: '32px', right: '0', height: '12px', width: '96px' }}
          />
          <Cover
            style={{ top: '52px', right: '0', height: '12px', width: '32px' }}
          />
          <Cover
            style={{ top: '72px', right: '0', height: '12px', width: '328px' }}
          />
        </ShimmerBase>
      </ShimmerStory>
    </Column>
  </LoadingScreenContainer>
);

export const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

export const displayLoadingCard = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingCard)
);

export const displayLoadingScreen = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingScreen)
);
