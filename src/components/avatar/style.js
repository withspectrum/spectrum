// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import ReactImage from 'react-image';
import { zIndex } from '../globals';
import { Link } from 'react-router-dom';
import { ProfileHeaderAction } from '../profile/style';
import { MEDIA_BREAK } from 'src/components/layout';

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props =>
    props.type === 'community' ? `${props.size / 8}px` : '100%'};
  border: none;
  background-color: ${theme.bg.default};

  ${props =>
    props.mobilesize &&
    css`
      @media (max-width: ${MEDIA_BREAK}px) {
        width: ${props => `${props.mobilesize}px`};
        height: ${props => `${props.mobilesize}px`};
      }
    `};
`;

export const AvatarLink = styled(Link)`
  display: flex;
  flex: none;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  border-radius: ${props =>
    props.type === 'community' ? `${props.size / 8}px` : '100%'};
`;

export const CoverAction = styled(ProfileHeaderAction)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: ${zIndex.tooltip + 1};
`;

export const Img = styled(ReactImage)`
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props =>
    props.type === 'community' ? `${props.size / 8}px` : '100%'};
  object-fit: cover;
  background-color: ${theme.bg.default};

  ${props =>
    props.mobilesize &&
    css`
      @media (max-width: ${MEDIA_BREAK}px) {
        width: ${props => `${props.mobilesize}px`};
        height: ${props => `${props.mobilesize}px`};
      }
    `};
`;

export const FallbackImg = styled.img`
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props =>
    props.type === 'community' ? `${props.size / 8}px` : '100%'};
  object-fit: cover;
  background-color: ${theme.bg.wash};

  ${props =>
    props.mobilesize &&
    css`
      @media (max-width: ${MEDIA_BREAK}px) {
        width: ${props => `${props.mobilesize}px`};
        height: ${props => `${props.mobilesize}px`};
      }
    `};
`;

export const LoadingImg = styled.div`
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props =>
    props.type === 'community' ? `${props.size / 8}px` : '100%'};
  background: ${theme.bg.wash};

  ${props =>
    props.mobilesize &&
    css`
      @media (max-width: ${MEDIA_BREAK}px) {
        width: ${props => `${props.mobilesize}px`};
        height: ${props => `${props.mobilesize}px`};
      }
    `};
`;

export const OnlineIndicator = styled.span`
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid
    ${props =>
      props.onlineBorderColor
        ? props.onlineBorderColor(props.theme)
        : props.theme.text.reverse};
  background: ${theme.success.alt};
  border-radius: 5px;
  bottom: 0;
  right: 0;
  z-index: 1;
`;
