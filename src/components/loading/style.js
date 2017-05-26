// @flow
// $FlowFixMe
import styled, { keyframes } from 'styled-components';
import { Card } from '../card';
import { hexa } from '../globals';

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
  animation-timing-function: ease-out;
  animation-name: ${containerFadeIn};
`;

export const ShimmerList = styled(Card)`
  padding: 16px;

  section {
    min-height: 164px;
  }
`;

export const ShimmerThread = styled(Card)`
  padding: 16px;

  section {
    min-height: 96px;
  }
`;

export const ShimmerProfile = styled(Card)`
  padding: 16px;

  section {
    min-height: 96px;
  }
`;

export const ShimmerDM = styled(ShimmerProfile)`
	padding: 16px;
	margin: 0;
	box-shadow: none;
	border-radius: 0;
	border-bottom: 2px solid ${({ theme }) => theme.bg.wash};

	section {
		min-height: 40px;
	}

	+ div {
		margin: 0;
	}
`;

export const ShimmerComposer = styled(Card)`
  padding: 16px;

  section {
    min-height: 24px;
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
  background: ${({ theme }) => theme.bg.wash};
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
  animation-timing-function: ease-out;
  background: linear-gradient(to right,
		${({ theme }) => theme.bg.wash} 8%,
		${({ theme }) => hexa(theme.generic.default, 0.9)} 18%,
		${({ theme }) => theme.bg.wash} 33%);
  background-size: 100% 140px;
  animation-name: ${placeHolderShimmer};
`;

export const Cover = styled.span`
  position: absolute;
  background: ${({ theme }) => theme.bg.default};
  z-index: 5;
`;

export const LoadingOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${({ theme }) => theme.bg.reverse};
	opacity: 0.95;
	width: 100%;
	height: 100%;
	z-index: 1000;
`;
