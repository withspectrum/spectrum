import styled, { css } from 'styled-components';
import { zIndex } from '../globals';
import Link from 'src/components/link';
import { ProfileHeaderAction } from '../profile/style';

export const HoverWrapper = styled.div`
  display: none;
  position: absolute;
  top: ${props => (props.bottom ? '100%' : 'auto')};
  bottom: ${props => (props.top ? '100%' : 'auto')};
  right: ${props => (props.left ? '0' : 'auto')};
  left: ${props => (props.right ? '0' : 'auto')};
  z-index: ${zIndex.tooltip};
  width: 256px;
  padding-bottom: 12px;

  &:hover {
    display: inline-block;
  }
`;

export const Status = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? '25%' : '100%')};
  border: none;
  background-color: ${({ theme }) => theme.bg.default};

  ${props =>
    props.mobileSize &&
    css`
      @media (max-width: 768px) {
        width: ${props => `${props.mobileSize}px`};
        height: ${props => `${props.mobileSize}px`};
      }
    `};

  &:after {
    content: '';
    position: absolute;
    display: ${props => (props.isOnline ? 'inline-block' : 'none')};
    width: ${props => (props.onlineSize === 'large' ? '8px' : '6px')};
    height: ${props => (props.onlineSize === 'large' ? '8px' : '6px')};
    background: ${props => props.theme.success.alt};
    border-radius: 100%;
    border: 2px solid ${props => props.theme.text.reverse};
    bottom: ${props =>
      props.onlineSize === 'large'
        ? '0'
        : props.onlineSize === 'small' ? '-1px' : '1px'};
    right: ${props =>
      props.onlineSize === 'large'
        ? '0'
        : props.onlineSize === 'small' ? '-6px' : '-3px'};
    z-index: ${zIndex.avatar};
  }

  &:hover {
    ${HoverWrapper} {
      display: inline-block;
    }
  }
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
  border-radius: 100%;
`;

export const AvatarNoLink = AvatarLink.withComponent('div');

export const CoverAction = styled(ProfileHeaderAction)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: ${zIndex.tooltip + 1};
`;

export const Img = styled.img`
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? '25%' : '100%')};
  object-fit: cover;

  ${props =>
    props.mobileSize &&
    css`
      @media (max-width: 768px) {
        width: ${props => `${props.mobileSize}px`};
        height: ${props => `${props.mobileSize}px`};
      }
    `};
`;

export const ImgPlaceholder = styled.div`
  display: inline-block;
  background-color: ${props => props.theme.bg.border};
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? '25%' : '100%')};
  object-fit: cover;

  ${props =>
    props.mobileSize &&
    css`
      @media (max-width: 768px) {
        width: ${props => `${props.mobileSize}px`};
        height: ${props => `${props.mobileSize}px`};
      }
    `};
`;
