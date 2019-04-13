// @flow
import theme from 'shared/theme';
import styled, { keyframes } from 'styled-components';
import { Card } from 'src/components/card';
import { hexa, FlexCol, zIndex } from 'src/components/globals';
import { Link } from 'react-router-dom';
import { MEDIA_BREAK } from 'src/components/layout';

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
  padding: 36px 32px;
  display: inline-block;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 16px;
  }

  section {
    min-height: 308px;
  }
`;

export const ShimmerThreadContent = styled(FlexCol)`
  padding: 0;
  margin-top: 32px;
  display: block;
  width: 100%;

  section {
    min-height: 132px;
  }
`;

export const ShimmerThread = styled(Card)`
  padding: 16px;

  section {
    min-height: 96px;
  }
`;

export const ShimmerInboxThread = styled.div`
  background: ${theme.bg.default};
  padding: 16px;
  border-bottom: 1px solid ${theme.bg.border};

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
  padding: 0;
  padding-bottom: 16px;
  box-shadow: none;

  section {
    min-height: 238px;
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
  border-bottom: 2px solid ${theme.bg.wash};

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
    min-height: 32px;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const ShimmerInboxComposer = styled.div`
  padding: 16px;
  background: ${theme.bg.default};
  margin: 8px 0;
  border-top: 1px solid ${theme.bg.border};
  border-bottom: 1px solid ${theme.bg.border};

  section {
    min-height: 32px;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const ShimmerSelect = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  width: 196px;
  max-height: 38px;
  margin-left: 8px;
  border-radius: 8px;
  background: ${theme.bg.default};
  border: 2px solid ${theme.bg.border};

  @media (max-width: ${MEDIA_BREAK}px) {
    width: calc(50% - 12px);
  }

  section {
    min-height: 12px;
    width: calc(100% - 16px);
  }
`;

export const StyledErrorSelect = styled.div`
  padding: 4px 12px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  max-height: 38px;
  border-radius: 8px;
  background: ${theme.bg.default};
  border: 2px solid ${theme.warn.default};
  color: ${theme.warn.default};
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
  background: ${theme.bg.wash};
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
    ${theme.bg.wash} 10%,
    ${({ theme }) => hexa(theme.generic.default, 0.65)} 20%,
    ${theme.bg.wash} 30%
  );
  ${/* background-size: 100%; */ ''} animation-name: ${placeHolderShimmer};
`;

export const Cover = styled.span`
  position: absolute;
  background: ${theme.bg.default};
  z-index: ${zIndex.loading + 2};
`;

export const CircularCover = styled(Cover)`
  background: radial-gradient(
    transparent 20px,
    ${({ theme }) => theme.bg.default} 10px
  );
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.bg.reverse};
  opacity: 0.95;
  width: 100%;
  height: 100%;
  z-index: ${zIndex.fullscreen};
`;

export const LoadingNavbarContainer = styled.nav`
  width: 100%;
  background: ${theme.text.default};
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

  @media (max-width: ${MEDIA_BREAK}px) {
    bottom: 0;
    top: auto;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.15);
    padding: 0;
  }
`;

export const LogoLink = styled(Link)`
  margin-right: 32px;

  @media (max-width: ${MEDIA_BREAK}px) {
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

export const GridProfile = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr;
  grid-template-rows: 160px 1fr;
  grid-template-areas: 'cover cover' 'meta content';
  grid-column-gap: 32px;
  width: 100%;
  max-width: 1280px;
  height: 100%;
  min-height: 100vh;
  background-color: ${theme.bg.default};

  @media (max-width: 1028px) {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 80px 1fr;
    grid-template-areas: 'cover cover' 'meta content';
  }

  @media (max-width: ${MEDIA_BREAK}px) {
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

export const LoadingCoverPhoto = styled.div`
  grid-area: cover;
  width: 100%;
  background-color: ${theme.bg.wash};
`;
