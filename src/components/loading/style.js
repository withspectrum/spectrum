// @flow
// $FlowFixMe
import styled, { keyframes } from 'styled-components';
import { Card } from '../card';

const containerFadeIn = keyframes`
	0%{
  	opacity: 0;
	}
  99% {
    opacity: 0;
  }
	100%{
			opacity: 1
	}
`;

export const LoadingScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 32px;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-name: ${containerFadeIn};
`;

export const ShimmerList = styled(Card)`
  padding: 16px;

  section {
    min-height: 164px;
  }
`;

export const ShimmerStory = styled(Card)`
  padding: 16px;

  section {
    min-height: 84px;
  }
`;

export const ShimmerProfile = styled(Card)`
  padding: 16px;

  section {
    min-height: 80px;
  }
`;

export const ShimmerComposer = styled(Card)`
  padding: 16px;

  section {
    min-height: 12px;
  }
`;

const placeHolderShimmer = keyframes`
	0%{
			transform: translateX(-100%) translateY(0%);
	}
	100%{
			transform: translateX(100%) translateY(0%);
	}
`;

export const ShimmerBase = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
  background: #f6f7f8;
  overflow: hidden;
`;

export const ShimmerLine = styled.span`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 4;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  background: linear-gradient(to right, #f6f7f8 8%, #F0F1F3 18%, #f6f7f8 33%);
  background-size: 100% 140px;
  animation-name: ${placeHolderShimmer};
`;

export const Cover = styled.span`
  position: absolute;
  background: #fff;
  z-index: 5;
`;
