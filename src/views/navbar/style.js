import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Transition, FlexRow, Gradient, hexa } from '../../components/globals';
import { Avatar } from '../../components/avatar';

export const UserProfileAvatar = styled(Avatar)`
  flex: 0 0 24px;
  border: 1px solid ${({ theme }) => theme.text.default};
  box-shadow: 0 0 0 2px ${props => (props.isPro ? props.theme.pro.default : 'rgba(255,255,255,0.9)')};
  background-color: ${({ theme }) => theme.generic.default};
  background-image: ${({ theme }) => Gradient(theme.generic.alt, theme.generic.default)};

  @media (max-width: 768px) {
    margin-top: 6px;
    margin-bottom: 2px;
    height: 24px;
    width: 24px;
    border: none;
    box-shadow: none;
  }
`;

export const Container = styled(FlexRow)`
  width: 100%;
  flex: 0 0 48px;
`;

export const Nav = styled(FlexRow)`
  width: 100%;
  background: ${({ theme }) => (process.env.NODE_ENV === 'production' ? theme.text.default : theme.warn.alt)};
  display: flex;
  align-items: stretch;
  color: ${({ theme }) => theme.text.reverse};
  justify-content: space-between;
  flex: 0 0 48px;
  padding: 0 16px;
  line-height: 1;
  box-shadow: 0 4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  z-index: 1000;

  @media (max-width: 768px) {
    order: 3;
    box-shadow: 0 -4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  }
`;

export const Section = styled(FlexRow)`
  align-items: stretch;

  @media (max-width: 768px) {
    flex: 1 1 ${props => (props.left ? '66%' : '33%')};
    justify-content: space-around;
    display: ${props => (props.hideOnMobile ? 'none' : 'flex')};
  }
`;

export const Spacer = styled(FlexRow)`
  height: 48px;
`;

export const LogoLink = styled(Link)`
  margin-right: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }

  ${() => process.env.NODE_ENV !== 'production' && css`
    &:after {
      content: "Dev";
      margin-top: 4px;
      font-size: 0.75em;
    }
  `}
`;

export const SigninLink = styled(Link)`
  width: 100%;
  display: flex;
  justify-content: center;
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
  ${/* display: flex;
  flex-direction: row; */ ''}
  ${/* justify-content: center; */ ''}
  align-items: stretch;
  align-self: stretch;
  position: relative;
  flex: 0 0 auto;

  &:hover {
    opacity: 1;
  }

  .dropdown {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 160px;
    padding: 8px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover .dropdown,
  .dropdown:hover {
    opacity: 1;
    pointer-events: auto;
    transition: ${Transition.hover.on};

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const IconLink = styled(Link)`
  display: flex;
  flex: 0 0 40px;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  margin: 0 8px;
  padding: 0 8px;
  opacity: 0.8;
  position: relative;
  width: 100%;

  &:hover {
    opacity: 1;
  }

  &[data-active~="true"] {
    box-shadow: inset 0 -4px 0 ${({ theme }) => theme.bg.default};
    opacity: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    opacity: 0.7;
    margin: 0;

    ${/* &[data-mobileWidth~="third"] {
      width: 33%;
    }

    &[data-mobileWidth~="half"] {
      width: 50%;
    } */ ''}

    &[data-active~="true"] {
      box-shadow: inset 0 0 0 ${({ theme }) => theme.bg.default};
      opacity: 1;
    }

    svg {
      width: 24px;
      height: 24px;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%)!important;
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
`;

export const LabelForTab = styled(Label)`
  display: none;
  @media (max-width: 768px) {
    display: inline;
  }
`;

export const DropdownHeader = styled(FlexRow)`
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  flex: 0 0 auto;
  align-self: stretch;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  font-weight: 800;
  font-size: 14px;
  color: ${({ theme }) => theme.text.alt};
`;

export const DropdownFooter = styled(FlexRow)`
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  flex: 0 0 auto;
  align-self: stretch;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
`;

export const UserProfileDropdownList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

export const UserProfileDropdownListItem = styled.li`
  font-size: 14px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  border-bottom: 2px solid ${props => props.theme.border.default};
  background: #fff;
  justify-content: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.text.default};
    background: ${props => props.theme.bg.wash};
  }
`;
