import styled from 'styled-components';
import { zIndex } from '../globals';
import { Link } from 'react-router-dom';
import { ProfileHeaderAction } from '../profile/style';

export const StyledAvatarFallback = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: ${props => (props.community ? `25%` : '100%')};
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  background-color: ${({ theme }) => theme.bg.default};
  position: relative;
  z-index: ${zIndex.avatar - 1};
`;

export const HoverWrapper = styled.div`
  display: none;
  position: absolute;
  top: ${props => (props.bottom ? '100%' : 'auto')};
  bottom: ${props => (props.top ? '100%' : 'auto')};
  right: ${props => (props.left ? '0' : 'auto')};
  left: ${props => (props.right ? '0' : 'auto')};
  z-index: ${zIndex.tooltip};
  width: 256px;

  &:hover {
    display: inline-block;
  }
`;

export const StyledAvatarStatus = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? `25%` : '100%')};
  border: none;
  background-color: ${({ theme }) => theme.bg.default};

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

export const StyledAvatar = styled.object`
  position: relative;
  display: inline-block;
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  border-radius: ${props => (props.community ? `25%` : '100%')};
  object-fit: cover;
`;

export const StyledAvatarLink = styled(Link)`
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
`;

export const CoverAction = styled(ProfileHeaderAction)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: ${zIndex.tooltip + 1};
`;
