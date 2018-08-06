// @flow
import styled, { css } from 'styled-components';
import Link from '../../components/link';
import { Button } from '../../components/buttons';
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
} from '../../components/globals';

export const Page = styled.main`
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'content';
  overflow: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.bg.default};
`;

export const Wrapper = styled(FlexCol)`
  grid-area: content;
  height: 100%;
  min-height: 100vh;
  min-width: 100vw;
  width: 100%;
  max-width: 100vw;
  background-color: ${({ theme }) => theme.bg.default};
  overflow: hidden;
  z-index: ${zIndex.base};
`;

export const Flexer = styled(FlexRow)`
  flex-wrap: wrap;

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Tagline = styled(H2)`
  font-weight: 900;
  font-size: 32px;
  margin-top: 8px;
  margin-bottom: 8px;
  color: inherit;

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
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
  background-color: ${props => props.theme.bg.default};
  background-image: none;
  color: ${props => props.theme.brand.alt};
  transition: ${Transition.hover.off};
  z-index: ${zIndex.card};

  &:hover {
    background-color: ${props => props.theme.bg.default};
    color: ${props => props.theme.brand.default};
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
    transition: ${Transition.hover.on};
  }
`;

export const SecondaryCTA = styled(PrimaryCTA)`
  color: ${props => props.theme.text.reverse};
  background-color: transparent;
  border: 2px solid transparent;

  &:hover {
    color: ${props => props.theme.text.reverse};
    background-color: transparent;
    border-color: ${props => props.theme.bg.default};
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
  color: ${({ theme }) => theme.text.reverse};
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
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};

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
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};

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
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.google.default : '#fff'};
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: stretch;
  align-content: stretch;
  flex: auto;
  position: relative;
  padding: 32px;
  background-color: ${({ theme }) => theme.bg.reverse};
  color: ${({ theme }) => theme.text.reverse};
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

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr;
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
    color: ${props => props.theme.text.alt};
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
      background-color: ${props => props.theme.text.reverse};
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

export const Support = styled(LinkSection)`
  grid-area: support;
`;

export const Safety = styled(LinkSection)`
  grid-area: safety;

  span + a,
  a + a {
    margin-top: 8px;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;

  > a + a {
    margin-left: 8px;
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
      background-color: ${({ theme }) => theme.bg.default};
      color: ${({ theme }) => theme.text.default};
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 768px) {
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
      background-color: ${({ theme }) => theme.bg.default};
      color: ${({ theme }) => theme.text.default};
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 768px) {
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
  grid-template-columns: auto 1fr repeat(3, auto);
  grid-column-gap: 32px;
  grid-template-rows: auto;
  grid-template-areas: 'logo . features pricing support auth';
  align-items: center;
  justify-items: center;
  color: ${props =>
    props.dark ? props.theme.text.reverse : props.theme.brand.alt};
  grid-area: tabs;
  z-index: ${zIndex.chrome + 1};
  line-height: 1;

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'logo . menu';
  }

  ${props =>
    props.dark &&
    css`
      button {
        color: ${props => props.theme.brand.alt};
        background-image: none;
        background-color: ${props => props.theme.bg.default};

        &:hover {
          color: ${props => props.theme.brand.default};
          background-color: ${props => props.theme.bg.default};
          box-shadow: 0 0 16px ${props => props.theme.brand.border};
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
      ? props.dark ? props.theme.text.reverse : props.theme.text.default
      : props.dark ? props.theme.text.reverse : props.theme.text.alt};

  &:hover {
    color: ${props =>
      props.selected
        ? props.dark ? props.theme.text.reverse : props.theme.text.default
        : props.dark ? props.theme.text.reverse : props.theme.text.alt};
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

    @media (max-width: 768px) {
      display: inline-block;
    }
  }

  > div:first-of-type {
    display: inline-block;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const DropdownLink = styled(Link)`
  padding: 16px 0;
  font-weight: 500;
  display: flex;
  width: 100%;
  align-items: center;
  transition: ${Transition.hover.off};
  color: ${props =>
    props.selected ? props.theme.text.placeholder : props.theme.brand.alt};
  border-radius: 8px;

  &:hover {
    transition: ${Transition.hover.on};
    color: ${props =>
      props.selected ? props.theme.text.alt : props.theme.brand.default};
  }
`;

export const LogoLink = styled(DropdownLink)`
  color: ${props => props.theme.text.placeholder};
  margin-bottom: 16px;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const AuthLink = styled(DropdownLink)`
  margin: 0;
  margin-top: 24px;
  padding: 16px 0;
  font-weight: 700;
  border-top: none;
  color: ${props => props.theme.text.reverse};
  background-image: ${props =>
    Gradient(props.theme.brand.alt, props.theme.brand.default)};
  justify-content: center;

  &:hover {
    color: ${props => props.theme.text.reverse};
    text-shadow: 0 0 32px ${props => hexa(props.theme.text.reverse, 0.5)};
  }
`;

export const MenuContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  width: 300px;
  padding: 16px;
  color: ${props => props.theme.brand.alt};
  background-color: ${props => props.theme.bg.default};
  background-image: ${props =>
    Gradient(props.theme.bg.default, props.theme.bg.wash)};
  box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.25)};
  padding-top: 32px;
  z-index: 2;
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

  > button {
    color: ${props =>
      props.dark ? props.theme.brand.border : props.theme.brand.alt};
    transform: none;

    &:hover {
      color: ${props =>
        props.dark ? props.theme.text.reverse : props.theme.brand.default};
      transform: none;
    }
  }

  ${MenuContainer} {
    display: ${props => (props.open ? 'flex' : 'none')};
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export const PricingTab = styled(Tab)`
  grid-area: pricing;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const FeaturesTab = styled(Tab)`
  grid-area: features;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SupportTab = styled(Tab)`
  grid-area: support;

  @media (max-width: 768px) {
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
        color: ${props => props.theme.brand.alt};
        background-image: none;
        background-color: ${props => props.theme.bg.default};

        &:hover {
          color: ${props => props.theme.brand.default};
          background-color: ${props => props.theme.bg.default};
          box-shadow: 0 0 16px ${props => props.theme.brand.border};
        }
      `};
  }

  > a > div {
    box-shadow: ${props =>
      props.dark ? `0 0 0 2px ${props.theme.bg.default}` : 'none'};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
