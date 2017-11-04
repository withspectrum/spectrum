import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Transition, FlexRow, hexa, zIndex } from '../../components/globals';
import Avatar from '../../components/avatar';

export const UserProfileAvatar = styled(Avatar)`
  flex: 0 0 24px;
  flex: 0 0 28px;
  height: 28px;
  width: 28px;
  margin-top: 0;
  border-radius: 100%;

  @media (max-width: 768px) {
    position: relative;
    box-shadow: none;
    margin: 1px 0 3px 0;

    > img {
      border: 2px solid ${({ theme }) => theme.text.reverse};
    }
  }

  @media (max-width: 360px) {
    margin: 0;
  }
`;

export const Nav = styled(FlexRow)`
  width: 100%;
  background: ${({ theme }) =>
    process.env.NODE_ENV === 'production'
      ? theme.text.default
      : theme.warn.alt};
  display: flex;
  align-items: stretch;
  color: ${({ theme }) => theme.text.reverse};
  justify-content: space-between;
  flex: 0 0 48px;
  padding: 0 16px;
  line-height: 1;
  box-shadow: 0 4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  z-index: ${zIndex.navBar};
  -webkit-transform: translate3d(0, 0, 0);

  @media (max-width: 768px) {
    padding: 0;
    order: 3;
    position: relative;
    box-shadow: 0 -4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  }
`;

export const Section = styled(FlexRow)`
  align-items: stretch;
  display: ${props => (props.hideOnDesktop ? 'none' : 'flex')};

  @media (max-width: 768px) {
    flex: auto;
    justify-content: space-around;
    display: ${props => (props.hideOnMobile ? 'none' : 'flex')};
  }
`;

export const LogoLink = styled(Link)`
  margin-left: 8px;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SigninLink = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  background: transparent;
  border: none;
  webkit-display: none;
  color: #fff;

  &:hover {
    cursor: pointer;
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

export const IconDrop = styled(FlexRow)`
  align-items: stretch;
  align-self: stretch;
  position: relative;
  flex: auto;

  &:hover {
    opacity: 1;
  }

  .dropdown {
    display: none;
    pointer-events: none;
    position: absolute;
    top: 100%;
    right: 0;
    padding: 8px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover .dropdown,
  .dropdown:hover {
    display: flex;
    pointer-events: auto;
    transition: ${Transition.hover.on};

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const IconLink = styled(Link)`
  display: flex;
  flex: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  margin: 0 8px;
  padding: 0 4px;
  padding-right: 8px;
  opacity: 0.8;
  position: relative;
  width: 100%;

  &:hover {
    opacity: 1;
  }

  &[data-active~='true'] {
    box-shadow: inset 0 -4px 0 ${({ theme }) => theme.bg.default};
    opacity: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    opacity: 0.7;
    margin: 0;

    &[data-active~='true'] {
      box-shadow: inset 0 0 0 ${({ theme }) => theme.bg.default};
      opacity: 1;
    }

    div {
      width: 32px;
      height: 32px;
    }
  }
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;

  @media (max-width: 768px) {
    font-size: 9px;
    text-transform: uppercase;
    font-weight: 700;
    margin-top: 2px;
    margin-left: 0;
  }

  @media (max-width: 360px) {
    display: none;
  }
`;

export const DropdownHeader = styled(FlexRow)`
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  flex: 0 0 auto;
  align-self: stretch;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-weight: 800;
  font-size: 14px;
  color: ${({ theme }) => theme.text.alt};
`;

export const DropdownFooter = styled(FlexRow)`
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  flex: 0 0 32px;
  align-self: stretch;
  justify-content: center;
  align-items: center;
  padding: 8px;

  button {
    display: flex;
    flex: 1;

    &:first-of-type:not(:last-of-type) {
      margin-right: 8px;
    }
  }
`;

export const Notification = styled.div`
  color: ${props => props.theme.text.default};
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  overflow-x: hidden;
`;
