// @flow
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';
import Link from 'src/components/link';

export const HoverWrapper = styled.div`
  position: absolute;
  z-index: ${zIndex.tooltip};
  width: 256px;
  ${props => props.popperStyle};

  @media (max-width: 768px) {
    display: none;
    pointer-events: none;
  }

  &:hover {
    display: inline-block;
  }
`;

export const Span = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  position: relative;
`;

export const ProfileCard = styled.div`
  width: 256px;
  background: ${props => props.theme.bg.default};
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
  min-height: 128px;
  overflow: hidden;
`;

export const Content = styled.div`
  padding: 0 8px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
`;

export const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  margin-top: 4px;
  line-height: 1.4;
  white-space: pre-wrap;

  a {
    font-weight: 500;
    color: ${props => props.theme.text.default};
  }

  a:hover {
    text-decoration: none;
  }
`;

export const Actions = styled.div`
  padding: 16px 8px 8px;
  display: flex;
  flex: 1 0 auto;

  > div {
    display: flex;
    flex: 1;
  }

  a,
  button {
    display: flex;
    flex: 1;
    justify-content: center;
  }
`;

export const CoverContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const CoverPhoto = styled.div`
  width: 100%;
  height: 88px;
  background-color: ${props =>
    props.src ? props.theme.text.default : props.theme.brand.alt};
  background-image: ${props => (props.src ? `url("${props.src}")` : 'none')};
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ProfilePhotoContainer = styled.div`
  position: relative;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  margin-bottom: -16px;

  img {
    box-shadow: 0 0 0 2px ${props => props.theme.bg.default};
  }
`;

/*

CHANNEL SPECIFIC

*/
export const ChannelCommunityLabel = styled.h5`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
`;

export const ChannelCommunityRow = styled(Link)`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 8px;

  img {
    margin-right: 8px;
  }

  &:hover {
    ${ChannelCommunityLabel} {
      color: ${props => props.theme.text.secondary};
    }
  }
`;
