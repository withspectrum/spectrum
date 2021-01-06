// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/button';
import { ViewGrid } from 'src/components/layout';
import {
  H2,
  FlexCol,
  FlexRow,
  P,
  Transition,
  Shadow,
  zIndex,
  hexa,
  Gradient,
} from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const Page = styled.main`
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'content';
  background-color: ${theme.bg.default};
`;

export const Wrapper = styled(FlexCol)`
  grid-area: content;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  background-color: ${theme.bg.default};
  overflow: hidden;
  z-index: ${zIndex.base};
`;

export const Flexer = styled(FlexRow)`
  flex-wrap: wrap;

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
  }
`;

export const Header = styled(FlexRow)`
  padding: 32px;
  justify-content: space-between;
  z-index: ${zIndex.card};
`;

export const Content = styled(FlexRow)`
  flex: auto;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
  }
`;

export const Tagline = styled(H2)`
  font-weight: 900;
  font-size: 32px;
  margin-top: 8px;
  margin-bottom: 8px;
  color: inherit;

  @media (max-width: ${MEDIA_BREAK}px) {
    margin-bottom: 32px;
  }
`;

export const Copy = styled(P)`
  max-width: 480px;
  width: 100%;
  font-size: 18px;
  line-height: 1.5;
  color: inherit;
  font-weight: 500;

  &:not(:first-of-type) {
    margin-top: 16px;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    text-align: left;
  }
`;

export const Bullets = styled(FlexRow)`
  align-self: stretch;
  flex: auto;
  justify-content: center;
  align-items: flex-start;
  margin: 32px 16px 16px;
  flex-wrap: wrap;

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
    margin-top: 0;
  }
`;

export const Bullet = styled(FlexCol)`
  display: inline-block;
  width: calc(33% - 64px);
  min-width: 320px;
  max-width: 480px;
  margin: 32px;
  margin-bottom: 0;

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100%;
    margin: 0;
    margin-top: 48px;
  }
`;

export const BulletHeading = styled(FlexRow)`
  align-items: center;
  white-space: nowrap;
  position: relative;
`;

export const BulletTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;

export const BulletCopy = styled.p`
  margin-top: 8px;
  font-weight: 500;
`;

export const PrimaryCTA = styled(Button)`
  padding: 8px 12px;
  font-weight: 700;
  font-size: 16px;
  border-radius: 12px;
  background-color: ${theme.bg.default};
  background-image: none;
  color: ${theme.brand.alt};
  transition: ${Transition.hover.off};
  z-index: ${zIndex.card};

  &:hover {
    background-color: ${theme.bg.default};
    color: ${theme.brand.default};
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
    transition: ${Transition.hover.on};
  }
`;

export const SecondaryCTA = styled(PrimaryCTA)`
  color: ${theme.text.reverse};
  background-color: transparent;
  border: 2px solid transparent;

  &:hover {
    color: ${theme.text.reverse};
    background-color: transparent;
    border-color: ${theme.bg.default};
    box-shadow: 0 0 8px 4px ${props => hexa(props.theme.bg.default, 0.5)};
  }
`;

export const SignInButton = styled.a`
  display: flex;
  flex-shrink: 1;
  z-index: ${zIndex.base + 1};
  flex-direction: flex-row;
  align-self: flex-start;
  align-items: center;
  color: ${theme.text.reverse};
  border-radius: 8px;
  padding: 8px;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 700;
  transition: ${Transition.hover.off};
  position: relative;
  margin: 16px 0;

  ${props =>
    props.after &&
    `
  		margin: 24px 0;

			&:after {
				content: 'Previously signed in with';
				position: absolute;
				top: -23px;
				font-size: 10px;
				font-weight: 500;
				text-transform: uppercase;
				opacity: 0.8;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				text-align: center;
				color: #fff;
			}
		`} span {
    display: inline-block;
    flex: 0 0 auto;
    margin-top: -1px;
    margin-left: 8px;
    line-height: 2.45;
    word-break: keep-all;
    white-space: nowrap;
    color: currentColor;
  }

  svg {
    fill: currentColor !important;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const LoginCard = styled.div`
  border-radius: 12px;
  padding: 16px 0;
  margin-top: 16px;
  align-self: flex-start;
  align-items: flex-start;
`;

export const ButtonTwitter = styled(Button)`
  background: ${props =>
    props.preferred ? props.theme.social.twitter.default : 'none'};
  color: ${props =>
    props.whitebg
      ? props.theme.social.twitter.default
      : props.preferred
      ? '#fff'
      : 'rgba(255,255,255,0.8)'};

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.twitter.default : '#fff'};
  }
`;

export const ButtonFacebook = styled(Button)`
  background: ${props =>
    props.preferred ? props.theme.social.facebook.default : 'none'};
  color: ${props =>
    props.whitebg
      ? props.theme.social.facebook.default
      : props.preferred
      ? '#fff'
      : 'rgba(255,255,255,0.8)'};

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.facebook.default : '#fff'};
  }
`;

export const ButtonGoogle = styled(Button)`
  background: ${props =>
    props.preferred ? props.theme.social.google.default : 'none'};
  color: ${props =>
    props.whitebg
      ? props.theme.social.google.default
      : props.preferred
      ? '#fff'
      : 'rgba(255,255,255,0.8)'};

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.google.default : '#fff'};
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: stretch;
  align-content: stretch;
  flex: none;
  position: relative;
  padding: 32px;
  background-color: ${theme.bg.default};
  color: ${theme.text.default};
`;

export const FooterGrid = styled.div`
  flex: auto;
  display: grid;
  grid-template-columns: auto 1fr repeat(2, minmax(160px, auto));
  grid-template-rows: 1fr;
  grid-column-gap: 32px;
  grid-template-areas: 'masthead . support safety';
  align-items: flex-start;
  justify-items: flex-start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-column-gap: 0;
    grid-row-gap: 32px;
    grid-template-areas: 'masthead' 'support' 'safety';
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;

  font-weight: 500;
  font-size: 16px;

  span {
    color: ${theme.text.alt};
    font-weight: 700;
  }
`;

export const Masthead = styled(FooterSection)`
  grid-area: masthead;
`;

export const LinkSection = styled(FooterSection)`
  a {
    position: relative;
    padding-bottom: 2px;
    display: inline-block;
    align-self: flex-start;

    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      content: '';
      height: 2px;
      width: 0%;
      opacity: 0;
      background-color: ${theme.text.reverse};
      transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
    }

    &:hover {
      &:after {
        width: 100%;
        opacity: 1;
        transition: opacity 0.2s ease-in-out, width 0.2s ease-in-out;
      }
    }
  }

  span + a,
  a + a {
    margin-top: 8px;
  }
`;

export const Safety = styled(LinkSection)`
  grid-area: safety;
  margin-top: 24px;

  span + a,
  a + a {
    margin-top: 8px;
  }
`;

export const LinkBlock = styled(Link)`
  display: inline-block;
  margin: 0 24px;
  flex: 0 0 auto;
  position: relative;

  &:hover {
    text-decoration: none;
  }

  div {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 16px;
    top: 4px;
    position: relative;
    text-align: center;
    transition: ${Transition.hover.off};
    border-radius: 12px;

    &:hover {
      background-color: ${theme.bg.default};
      color: ${theme.text.default};
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 16px;

    div {
      border-bottom: none;

      &:hover {
        border-bottom: none;
      }
    }
  }
`;

export const LinkBlockA = styled.a`
  display: inline-block;
  margin: 0 24px;
  flex: 0 0 auto;
  position: relative;

  &:hover {
    text-decoration: none;
  }

  div {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 16px;
    top: 4px;
    position: relative;
    text-align: center;
    transition: ${Transition.hover.off};
    border-radius: 12px;

    &:hover {
      background-color: ${theme.bg.default};
      color: ${theme.text.default};
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 16px;

    div {
      border-bottom: none;

      &:hover {
        border-bottom: none;
      }
    }
  }
`;

export const NavContainer = styled.div`
  display: grid;
  grid-template-rows: 68px;
  grid-template-columns: auto;
  grid-template-areas: 'tabs';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export const Tabs = styled.div`
  display: grid;
  padding: 0 16px;
  grid-template-columns: auto 1fr repeat(2, auto);
  grid-column-gap: 32px;
  grid-template-rows: auto;
  grid-template-areas: 'logo . login auth';
  align-items: center;
  justify-items: center;
  color: ${props =>
    props.dark ? props.theme.text.reverse : props.theme.brand.alt};
  grid-area: tabs;
  z-index: ${zIndex.chrome + 1};
  line-height: 1;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'logo . menu';
  }

  ${props =>
    props.dark &&
    css`
      button {
        color: ${theme.brand.alt};
        background-image: none;
        background-color: ${theme.bg.default};

        &:hover {
          color: ${theme.brand.default};
          background-color: ${theme.bg.default};
          box-shadow: 0 0 16px ${theme.brand.border};
        }
      }
    `};
`;

export const Tab = styled(Link)`
  padding: 4px 8px;
  font-size: 16px;
  font-weight: ${props => (props.selected ? '700' : '500')};
  color: ${props =>
    props.selected
      ? props.dark
        ? props.theme.text.reverse
        : props.theme.text.default
      : props.dark
      ? props.theme.text.reverse
      : props.theme.text.alt};

  &:hover {
    color: ${props =>
      props.selected
        ? props.dark
          ? props.theme.text.reverse
          : props.theme.text.default
        : props.dark
        ? props.theme.text.reverse
        : props.theme.text.alt};
    text-shadow: ${props =>
      props.dark ? `0 0 32px ${hexa(props.theme.text.reverse, 0.75)}` : 'none'};
  }
`;

export const LogoTab = styled(Tab)`
  grid-area: logo;
  color: ${props =>
    props.dark ? props.theme.text.reverse : props.theme.brand.alt};

  > div:last-of-type {
    display: none;

    @media (max-width: ${MEDIA_BREAK}px) {
      display: inline-block;
    }
  }

  > div:first-of-type {
    display: inline-block;

    @media (max-width: ${MEDIA_BREAK}px) {
      display: none;
    }
  }
`;

export const DropdownLink = styled(Link)`
  padding: 16px 0;
  font-weight: ${props => (props.selected ? '600' : '500')};
  display: flex;
  width: 100%;
  align-items: center;
  transition: ${Transition.hover.off};
  color: ${props =>
    props.selected ? props.theme.brand.alt : props.theme.text.alt};
  border-radius: 8px;

  &:hover {
    transition: ${Transition.hover.on};
    color: ${props =>
      props.selected ? props.theme.brand.default : props.theme.text.secondary};
  }
`;

export const LogoLink = styled(DropdownLink)`
  color: ${theme.text.placeholder};
  margin-bottom: 16px;

  &:hover {
    color: ${theme.brand.alt};
  }
`;
export const ExploreLink = styled(DropdownLink)`
  grid-area: explore;
`;

export const AuthLink = styled(DropdownLink)`
  margin: 0;
  margin-top: 24px;
  padding: 16px 0;
  font-weight: 700;
  border-top: none;
  color: ${theme.text.reverse};
  background-image: ${props =>
    Gradient(props.theme.brand.alt, props.theme.brand.default)};
  justify-content: center;

  &:hover {
    color: ${theme.text.reverse};
    text-shadow: 0 0 32px ${props => hexa(props.theme.text.reverse, 0.5)};
  }
`;

export const LoginLink = styled(DropdownLink)`
  grid-area: login;
`;

export const MenuContainer = styled.div`
  position: fixed;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 16px repeat(2, auto) 1fr auto;
  grid-template-areas: 'logo' '.' 'explore' 'login' '.' 'auth';
  align-content: start;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  width: 300px;
  padding: 16px;
  color: ${theme.brand.alt};
  background-color: ${theme.bg.default};
  background-image: ${props =>
    Gradient(props.theme.bg.default, props.theme.bg.wash)};
  box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.25)};
  padding-top: 32px;
  z-index: 2;
  flex-direction: column;
`;

export const MenuOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  min-width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-color: ${props => hexa(props.theme.bg.reverse, 0.5)};
  display: ${props => (props.open ? 'block' : 'none')};
  z-index: 1;
`;

export const MenuTab = styled.div`
  grid-area: menu;
  color: ${props =>
    props.dark ? props.theme.brand.border : props.theme.brand.alt};

  > button {
    &:hover {
      color: ${props =>
        props.dark ? props.theme.text.reverse : props.theme.brand.default};
      transform: none;
    }
  }

  ${MenuContainer} {
    display: ${props => (props.open ? 'flex' : 'none')};
  }

  @media (min-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const LoginTab = styled(Tab)`
  grid-area: login;

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const AuthTab = styled.div`
  grid-area: auth;
  color: ${props =>
    props.dark ? props.theme.text.reverse : props.theme.brand.alt};

  > a > button {
    font-weight: 700;

    ${props =>
      props.dark &&
      css`
        color: ${theme.brand.alt};
        background-image: none;
        background-color: ${theme.bg.default};

        &:hover {
          color: ${theme.brand.default};
          background-color: ${theme.bg.default};
          box-shadow: 0 0 16px ${theme.brand.border};
        }
      `};
  }

  > a > div {
    box-shadow: ${props =>
      props.dark ? `0 0 0 2px ${props.theme.bg.default}` : 'none'};
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const StyledViewGrid = styled(ViewGrid)`
  @media (max-width: ${MEDIA_BREAK}px) {
    max-height: 100vh;
  }
`;
