// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { zIndex, Shadow } from '../../../components/globals';

export const Cluster = styled.img`
  position: absolute;
  opacity: 0.05;
`;

export const ClusterOne = styled(Cluster)`
	max-width: 120px;
	max-height: 120px;
	top: 10%;
	left: 10%;
	z-index: ${zIndex.background};
`;

export const ClusterTwo = styled(Cluster)`
	max-width: 160px;
	max-height: 160px;
	top: 60%;
	right: 10%;
	z-index: ${zIndex.background};
`;

export const ClusterThree = styled(Cluster)`
	max-width: 80px;
	max-height: 80px;
	top: 10%;
	right: 40%;
	z-index: ${zIndex.background};
`;

export const ClusterFour = styled(Cluster)`
	max-width: 80px;
	max-height: 80px;
	top: 80%;
	left: 40%;
	z-index: ${zIndex.background};
`;

export const Constellations = styled.div`
  position: absolute;
  background-color: transparent;
  background: url('/img/constellations.svg') center top no-repeat;
  background-size: cover 100%;
  z-index: ${zIndex.background};
  height: calc(100% + 4px);
  width: 110%;
  top: -10px;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`;

export const ConversationWrapper = styled.div`
  position: relative;
  z-index: ${zIndex.background};

  max-width: 480px;
  overflow-y: hidden;
  box-shadow: 0 0 32px 24px ${props => props.theme.bg.default};
  display: inline-block;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    left: auto;
    order: 2;
    width: 100%;
  }

  > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  + div {
    margin-left: 48px;

    @media (max-width: 768px) {
      margin-left: 0;
      margin-bottom: 32px;
    }
  }
`;

export const Conversation = () =>
  <ConversationWrapper>
    <img src="/img/conversation.svg" />
  </ConversationWrapper>;

const DiscoverImage = styled.img`
  position: relative;
  left: -24px;
  max-width: 400px;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    left: auto;
    margin-top: 32px;
    max-width: 100%;
    min-width: 256px;
  }
`;

export const Discover = () => <DiscoverImage src="/img/discover.png" />;
