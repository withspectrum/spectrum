import styled, { css } from 'styled-components';
import Link from 'src/components/link';
import { Transition, FlexRow, hexa, zIndex } from '../../components/globals';
import Avatar from '../../components/avatar';

export const UserProfileAvatar = styled(Avatar)`
  margin-top: 0;
  border-radius: 100%;
  box-shadow: 0 0 0 2px ${props => props.theme.bg.default};

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

  ${p => p.hideOnMobile && css`@media (max-width: 768px) {display: none;}`};
`;

export const Section = styled(FlexRow)`
  align-items: stretch;
  display: flex;
  flex: auto;

  @media (max-width: 768px) {
    flex: auto;
    justify-content: space-around;
    display: ${props => (props.hideOnMobile ? 'none' : 'flex')};
  }
`;

export const LoggedOutSection = styled(FlexRow)`
  display: flex;
  flex: auto;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex: auto;
    justify-content: center;
    display: flex;
  }
`;

export const SectionFlex = styled.div`
  display: flex;
  flex: 1 1 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LogoLink = styled(Link)`
  margin-left: 8px;
  margin-right: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
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
  flex: 0 1;

  &:hover {
    opacity: 1;
    /*
      this padding left makes it so that there is a left zone on the
      icon that the user can mouseover without un-hovering the dropdown
     */
    ${props =>
      props.padOnHover &&
      css`
        @media (min-width: 768px) {
          padding-left: 120px;
        }
      `};
  }

  @media (max-width: 768px) {
    flex: 1 1;
    ${props => props.hideOnMobile && css`display: none;`};
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
  flex: 1 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  ${'' /* margin: 0 8px; */} padding: 0 16px;
  opacity: 0.8;
  position: relative;
  width: 100%;

  &.hideOnDesktop {
    display: none;
  }

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

    &.hideOnDesktop {
      display: flex;
    }

    &.hideOnMobile {
      display: none;
    }

    div {
      width: 32px;
      height: 32px;
    }
  }
`;

export const ExploreLink = styled(IconLink)`
  width: auto;
  align-self: center;
  flex: none;
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;
  ${props =>
    props.hideOnDesktop && css`display: none;`} @media (max-width: 768px) {
    display: flex;
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
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text.alt};

  a {
    display: flex;
    align-items: center;

    &:hover {
      color: ${props => props.theme.brand.alt};
    }
  }
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

    &:hover {
      color: ${props => props.theme.brand.alt};
      background: ${props => props.theme.bg.wash};
    }
  }
`;

export const Notification = styled.div`
  color: ${props => props.theme.text.default};
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  overflow-x: hidden;
`;

export const MarkAllSeen = styled.span`
  color: ${props =>
    props.isActive ? props.theme.brand.alt : props.theme.text.alt};
  cursor: pointer;

  &:hover {
    color: ${props =>
      props.isActive ? props.theme.brand.default : props.theme.text.alt};
  }
`;
