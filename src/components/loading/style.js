// @flow
// $FlowFixMe
import styled, { keyframes } from 'styled-components';
import { Card } from '../card';
import { hexa, FlexCol, zIndex } from '../globals';
// $FlowFixMe
import Link from 'src/components/link';

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

export const ShimmerListLite = styled(Card)`
  padding: 16px;
  border-radius: 4px;
  box-shadow: none;

  section {
    min-height: 164px;
  }
`;

export const ShimmerThreadDetail = styled(FlexCol)`
  padding: 40px 32px;
  display: inline-block;

  @media (max-width: 768px) {
    padding: 16px;
  }

  section {
    min-height: 308px;
  }
`;

export const ShimmerThread = styled(Card)`
  padding: 16px;

  section {
    min-height: 96px;
  }
`;

export const ShimmerInboxThread = styled.div`
  background: ${props => props.theme.bg.default};
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.bg.border};

  section {
    min-height: 96px;
  }

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const ShimmerProfile = styled(Card)`
  padding: 16px;

  section {
    min-height: 96px;
  }
`;

export const ShimmerProfileLite = styled(Card)`
  border-radius: 4px;
  padding: 16px;
  box-shadow: none;

  section {
    min-height: 96px;
  }
`;

export const ShimmerListItem = styled(FlexCol)`
  padding: 8px 0;

  section {
    min-height: 32px;
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

export const ShimmerBubble = styled(FlexCol)`
  margin-top: 4px;
  margin-left: 32px;
  align-self: flex-start;
  width: 60%;

  section {
    min-height: 48px;
    border-radius: 12px;
  }
`;

export const ShimmerChat = styled(FlexCol)`
  margin-top: 32px;

  > div:nth-of-type(2n + 2) {
    width: 40%;

    section {
      min-height: 32px;
    }
  }

  > div:nth-of-type(3n + 1) {
    width: 25%;

    section {
      min-height: 32px;
    }
  }

  > div:nth-of-type(4n) {
    align-self: flex-end;
    margin-top: 16px;
    margin-left: 0;
    margin-right: 32px;

    > section {
      background: ${({ theme }) => theme.brand.alt};

      > span {
        background: linear-gradient(
          to right,
          ${({ theme }) => theme.brand.alt} 10%,
          ${({ theme }) => hexa(theme.brand.default, 0.35)} 20%,
          ${({ theme }) => theme.brand.alt} 30%
        );
      }
    }
  }

  > div:nth-of-type(5n) {
    align-self: flex-end;
    margin-top: 4px;
    margin-bottom: 16px;
    margin-left: 0;
    margin-right: 32px;

    > section {
      background: ${({ theme }) => theme.brand.alt};

      > span {
        background: linear-gradient(
          to right,
          ${({ theme }) => theme.brand.alt} 10%,
          ${({ theme }) => hexa(theme.brand.default, 0.25)} 20%,
          ${({ theme }) => theme.brand.alt} 30%
        );
      }
    }
  }
`;

export const ShimmerComposer = styled(Card)`
  padding: 16px;

  section {
    min-height: 32px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ShimmerInboxComposer = styled.div`
  padding: 16px;
  background: ${props => props.theme.bg.default};
  margin: 8px 0;
  border-top: 1px solid ${props => props.theme.bg.border};
  border-bottom: 1px solid ${props => props.theme.bg.border};

  section {
    min-height: 32px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ShimmerSelect = styled.div`
  padding: 10px 12px;
  width: 196px;
  margin-left: 8px;
  border-radius: 8px;
  background: ${props => props.theme.bg.default};
  border: 2px solid ${props => props.theme.bg.border};

  @media (max-width: 768px) {
    width: calc(50% - 12px);
  }

  section {
    min-height: 12px;
    width: calc(100% - 16px);
  }
`;

const placeHolderShimmer = keyframes`
	0%{
			transform: translateX(-100%) translateY(0%);
			background-size: 100%;
			opacity: 1;
	}
	100%{
			transform: translateX(200%) translateY(0%);
			background-size: 500%;
			opacity: 0;
	}
`;

export const ShimmerBase = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: ${zIndex.loading};
  background: ${({ theme }) => theme.bg.wash};
  overflow: hidden;
`;

export const ShimmerLine = styled.span`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: ${zIndex.loading + 1};
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.bg.wash} 10%,
    ${({ theme }) => hexa(theme.generic.default, 0.65)} 20%,
    ${({ theme }) => theme.bg.wash} 30%
  );
  ${/* background-size: 100%; */ ''} animation-name: ${placeHolderShimmer};
`;

export const Cover = styled.span`
  position: absolute;
  background: ${({ theme }) => theme.bg.default};
  z-index: ${zIndex.loading + 2};
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
  z-index: ${zIndex.fullscreen};
`;

export const LoadingNavbarContainer = styled.nav`
  width: 100%;
  background: ${({ theme }) => theme.text.default};
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: space-between;
  height: 48px;
  padding: 0 32px 0 16px;
  line-height: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: ${zIndex.chrome};

  span {
    position: relative;
  }

  @media (max-width: 768px) {
    bottom: 0;
    top: auto;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.15);
    padding: 0;
  }
`;

export const LogoLink = styled(Link)`
  margin-right: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Logo = styled.img`
  width: 16px;
  height: 16px;
  align-self: center;
  position: relative;
  top: 1px;
  left: 1px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr minmax(240px, 2fr);
  grid-template-rows: 160px 1fr;
  grid-template-areas: 'cover cover cover' 'meta content extras';
  grid-column-gap: 32px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.bg.default};

  @media (max-width: 1028px) {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 80px 1fr;
    grid-template-areas: 'cover cover' 'meta content';
  }

  @media (max-width: 768px) {
    grid-template-rows: 80px auto 1fr;
    grid-template-columns: 100%;
    grid-column-gap: 0;
    grid-row-gap: 16px;
    grid-template-areas: 'cover' 'meta' 'content';
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Meta = styled(Column)`
  grid-area: meta;
`;

export const GridContent = styled(Column)`
  grid-area: content;
`;

export const Extras = styled(Column)`
  grid-area: extras;

  @media (max-width: 1028px) {
    display: none;
  }

  @media (min-width: 768px) {
    padding-right: 32px;
  }
`;

export const LoadingCoverPhoto = styled.div`
  grid-area: cover;
  width: 100%;
  background-color: ${({ theme }) => theme.bg.wash};
`;
