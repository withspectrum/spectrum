import styled, { css } from 'styled-components';
import Link from 'src/components/link';
import { Transition, FlexRow, hexa, zIndex } from '../../components/globals';
import Avatar from '../../components/avatar';

export const Nav = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, auto) 1fr repeat(2, auto);
  grid-template-rows: 1fr;
  grid-template-areas: 'logo home messages explore . notifications profile';
  align-items: stretch;
  padding: 0 32px;
  width: 100%;
  flex: 0 0 48px;
  padding: 0 16px;
  line-height: 1;
  box-shadow: 0 4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  z-index: ${zIndex.navBar};
  background: ${({ theme }) =>
    process.env.NODE_ENV === 'production' ? theme.bg.reverse : theme.warn.alt};

  @media (max-width: 768px) {
    padding: 0;
    order: 3;
    position: relative;
    box-shadow: 0 -4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
    grid-template-columns: repeat(5, 20%);
    grid-template-areas: 'home messages explore notifications profile';
  }

  .hideOnMobile {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .hideOnDesktop {
    @media (min-width: 769px) {
      display: none;
    }
  }

  ${props =>
    props.loggedOut &&
    css`
      grid-template-columns: auto auto auto auto 1fr;
      grid-template-areas: 'logo explore support pricing .';

      @media (max-width: 768px) {
        grid-template-columns: auto auto auto auto;
        grid-template-areas: 'home explore support pricing';
      }
    `} ${props =>
    props.hideOnMobile &&
    css`
      @media (max-width: 768px) {
        display: none;
      }
    `};
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  margin-left: 12px;

  ${props =>
    props.hideOnDesktop &&
    css`
      display: none;
    `} @media (max-width: 768px) {
    font-size: 10px;
    font-weight: 700;
    margin: 0;
    display: inline-block;
  }

  @media (max-width: 360px) {
    display: none;
  }
`;

export const Tab = styled(Link)`
  display: grid;
  grid-template-columns: 'auto auto';
  grid-template-rows: 'auto';
  grid-template-areas: 'icon label';
  align-items: center;
  justify-items: center;
  padding: 0 16px;
  color: ${({ theme }) =>
    process.env.NODE_ENV === 'production'
      ? theme.text.placeholder
      : theme.warn.border};
  transition: ${Transition.hover.off};

  > div {
    grid-area: icon;
  }

  > ${Label} {
    grid-area: label;
  }

  @media (min-width: 768px) {
    &[data-active~='true'] {
      box-shadow: inset 0 -4px 0 ${({ theme }) => theme.text.reverse};
      color: ${props => props.theme.text.reverse};
      transition: ${Transition.hover.on};

      &:hover,
      &:focus {
        box-shadow: inset 0 -6px 0 ${({ theme }) => theme.text.reverse};
        transition: ${Transition.hover.on};
      }
    }

    &:hover,
    &:focus {
      box-shadow: inset 0 -4px 0 ${({ theme }) => (process.env.NODE_ENV === 'production' ? theme.text.placeholder : theme.warn.border)};
      color: ${props => props.theme.text.reverse};
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 768px) {
    color: ${props =>
      process.env.NODE_ENV === 'production'
        ? props.theme.text.placeholder
        : props.theme.warn.border};
    padding: 0;
    grid-template-columns: 'auto';
    grid-template-rows: 'auto auto';
    grid-template-areas: 'icon' 'label';
    align-content: center;

    &[data-active~='true'] {
      color: ${props => props.theme.text.reverse};
      transition: ${Transition.hover.on};
    }
  }
`;

export const DropTab = styled(FlexRow)`
  align-items: stretch;
  align-self: stretch;
  position: relative;
  flex: auto;
  flex: 0 1;

  &:hover {
    /*
      this padding left makes it so that there is a left zone on the
      icon that the user can mouseover without un-hovering the dropdown
     */
    ${props =>
      props.padOnHover &&
      css`
        @media (min-width: 768px) {
          color: ${props => props.theme.text.reverse};
          padding-left: 120px;
        }
      `};
  }

  @media (max-width: 768px) {
    flex: auto;
    justify-content: center;
    ${props =>
      props.hideOnMobile &&
      css`
        display: none;
      `};
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

export const Logo = styled(Tab)`
  grid-area: logo;
  padding: 0 24px 0 4px;
  color: ${({ theme }) => theme.text.reverse};
  opacity: 1;

  &:hover {
    box-shadow: none;
  }

  @media (max-width: 768px) {
    display: none;
  }

  ${props =>
    props.isHidden &&
    css`
      display: none;
    `};
`;

export const HomeTab = styled(Tab)`
  grid-area: home;
`;

export const MessageTab = styled(Tab)`
  grid-area: messages;
`;

export const ExploreTab = styled(Tab)`
  grid-area: explore;

  ${props =>
    props.loggedOut &&
    css`
      grid-area: explore;
    `} ${Label} {
    @media (max-width: 768px) {
      display: flex;
    }

    @media (max-width: 360px) {
      display: none;
    }
  }
`;

export const SupportTab = styled(Tab)`
  grid-area: support;
`;

export const PricingTab = styled(MessageTab)`
  grid-area: pricing;
`;

export const NotificationTab = styled(DropTab)`
  grid-area: notifications;

  > a {
    &:hover {
      box-shadow: none;
      transition: none;
    }
  }
`;

export const ProfileDrop = styled(DropTab)`
  grid-area: profile;

  > a {
    &:hover {
      box-shadow: none;
      transition: none;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ProfileTab = styled(Tab)`
  grid-area: profile;
`;

export const Navatar = styled(Avatar)`
  margin-top: 0;
  border-radius: 100%;
  box-shadow: 0 0 0 2px ${props => props.theme.bg.default};
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

// We make it a real link element because anchor links don’t work properly with React Router.
// Ref: https://github.com/ReactTraining/react-router/issues/394.
export const SkipLink = Tab.withComponent('a').extend`
  grid-area: logo;
  overflow: hidden;
  height: 1px;
  width: 1px;

  &:focus {
    height: auto;
    width: auto;
  }
`;
