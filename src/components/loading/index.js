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
  ShimmerThread,
  ShimmerProfile,
  ShimmerDM,
  ShimmerComposer,
  ShimmerBase,
  ShimmerLine,
  Cover,
  LoadingOverlay,
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
}: { size?: Number, color?: String }): React$Element<any> => (
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
}: { size?: Number, color?: String }): React$Element<any> => (
  <LoadingCardContainer>
    <Spinner size={size} color={color} />
  </LoadingCardContainer>
);

export const LoadingGallery = (): React$Element<any> => (
  <LoadingOverlay>
    <Spinner size={'32'} color={'bg.default'} />
  </LoadingOverlay>
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
          left: '24px',
          height: '8px',
          width: '100%',
        }}
      />
      <Cover
        style={{
          top: '8px',
          left: '24px',
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
          top: '4px',
          left: '4px',
          height: '16px',
          width: '16px',
        }}
      />
      <Cover
        style={{
          bottom: '0',
          left: '24px',
          height: '8px',
          width: '100%',
        }}
      />
    </ShimmerBase>
  </ShimmerComposer>
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
      <ShimmerList>
        <ShimmerBase>
          <ShimmerLine />

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
              top: '40px',
              left: '0',
              height: '24px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '0px',
              right: '0',
              height: '16px',
              width: '10%',
            }}
          />
          <Cover
            style={{
              top: '24px',
              right: '0',
              height: '16px',
              width: '35%',
            }}
          />

          <Cover
            style={{
              top: '80px',
              left: '0',
              height: '16px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '104px',
              left: '0',
              height: '16px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '64px',
              right: '0',
              height: '16px',
              width: '40%',
            }}
          />
          <Cover
            style={{
              top: '96px',
              right: '0',
              height: '16px',
              width: '20%',
            }}
          />

          <Cover
            style={{
              top: '136px',
              left: '0',
              height: '16px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '160px',
              left: '0',
              height: '24px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '120px',
              right: '0',
              height: '16px',
              width: '30%',
            }}
          />
          <Cover
            style={{
              top: '148px',
              right: '0',
              height: '16px',
              width: '50%',
            }}
          />

        </ShimmerBase>
      </ShimmerList>
    </Column>

    <Column type="primary" alignItems="center">
      <LoadingComposer />

      <LoadingThread />

      <ShimmerThread>
        <ShimmerBase>
          <ShimmerLine />
          <Cover
            style={{
              top: '16px',
              left: '84px',
              height: '16px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '24px',
              left: '84px',
              height: '10px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '44px',
              left: '84px',
              height: '10px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '64px',
              left: '84px',
              height: '10px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '84px',
              left: '84px',
              height: '10px',
              width: '100%',
            }}
          />
          <Cover
            style={{
              top: '0px',
              left: '84px',
              height: '84px',
              width: '16px',
            }}
          />
          <Cover
            style={{
              top: '0',
              right: '0',
              height: '16px',
              width: '128px',
            }}
          />
          <Cover
            style={{
              top: '32px',
              right: '0',
              height: '12px',
              width: '32px',
            }}
          />
          <Cover
            style={{
              top: '52px',
              right: '0',
              height: '12px',
              width: '90px',
            }}
          />
          <Cover
            style={{
              top: '72px',
              right: '0',
              height: '12px',
              width: '156px',
            }}
          />
        </ShimmerBase>
      </ShimmerThread>

      <LoadingThread />
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

export const displayLoadingCard = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingCard)
);

export const displayLoadingScreen = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingScreen)
);

export const displayLoadingComposer = branch(
  props => props.data.loading,
  renderComponent(LoadingComposer)
);
