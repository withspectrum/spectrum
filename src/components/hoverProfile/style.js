// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';
import { Link } from 'react-router-dom';
import { MEDIA_BREAK } from 'src/components/layout';

export const HoverWrapper = styled.div`
  padding: 12px;
  margin-left: -12px;
  z-index: ${zIndex.tooltip};
  width: 256px;
  ${props => props.popperStyle};

  @media (max-width: ${MEDIA_BREAK}px) {
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

export const PopperWrapper = styled.div`
  z-index: 6001;
  ${props => props.popperStyle};
`;

export const ProfileCard = styled.div`
  width: 256px;
  background: ${theme.bg.default};
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.16);
  min-height: 128px;
  overflow: hidden;
`;

export const Content = styled.div`
  padding: 0 12px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.text.default};
  line-height: 1.2;
`;

export const Username = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.text.alt};
  line-height: 1.2;
  margin-top: 4px;
`;

export const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.text.secondary};
  margin-top: 8px;
  line-height: 1.4;
  white-space: pre-wrap;

  a {
    font-weight: 500;
    color: ${theme.text.default};
  }

  a:hover {
    text-decoration: none;
  }
`;

export const Actions = styled.div`
  padding: 16px 12px 12px;
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
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  margin-bottom: -16px;

  img {
    box-shadow: 0 0 0 2px ${theme.bg.default};
  }
`;

/*

CHANNEL SPECIFIC

*/
export const ChannelCommunityLabel = styled.h5`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.alt};
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
      color: ${theme.text.secondary};
    }
  }
`;
