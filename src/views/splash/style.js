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

export const Wrapper = styled(FlexCol)`
  flex: 1 0 auto;
  width: 100%;
  background-color: ${({ theme }) => theme.bg.default};
  overflow: auto;
  overflow-x: hidden;
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

export const Footer = styled(FlexRow)`
  position: relative;
  flex: auto;
  justify-content: space-between;
  padding: 24px 24px 24px 40px;
  background-color: ${({ theme }) => theme.bg.reverse};
  color: ${({ theme }) => theme.text.reverse};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

export const LinkBlock = styled.a`
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
  grid-template-rows: 96px 8px;
  grid-template-columns: auto;
  grid-template-areas: 'tabs' 'goop';
  grid-area: nav;
`;

export const Tabs = styled.div`
  display: grid;
  padding: 0 32px;
  grid-template-columns: auto 1fr repeat(3, auto);
  grid-column-gap: 32px;
  grid-template-rows: auto;
  grid-template-areas: 'logo . pricing support auth';
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
  transition: ${Transition.hover.off};
  font-weight: ${props => (props.selected ? '900' : '500')};
  color: ${props =>
    props.selected
      ? props.dark ? props.theme.text.reverse : props.theme.brand.alt
      : props.dark
        ? props.theme.text.reverse
        : hexa(props.theme.brand.alt, 0.5)};

  &:hover {
    transition: ${Transition.hover.on};
    color: ${props =>
      props.selected
        ? props.dark ? props.theme.text.reverse : props.theme.brand.default
        : props.dark ? props.theme.text.reverse : props.theme.brand.alt};
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

const DropdownLink = styled(Link)`
  padding: 16px 0;
  margin: 0 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-template-rows: 1fr;
  grid-template-areas: 'icon label . arrow';
  transition: ${Transition.hover.off};
  color: ${props =>
    props.selected ? props.theme.text.placeholder : props.theme.brand.alt};

  > div:last-of-type {
    grid-area: arrow;
    opacity: 0;
    display: ${props => (props.selected ? 'none' : 'inline-block')};
    transition: ${Transition.hover.off};
  }

  > div:first-of-type {
    grid-area: icon;
    margin-right: 16px;
  }

  > span {
    grid-area: label;
  }

  &:hover {
    transition: ${Transition.hover.on};
    color: ${props =>
      props.selected ? props.theme.text.alt : props.theme.brand.default};

    > div:last-of-type {
      opacity: 1;
      transition: ${Transition.hover.on};
    }
  }
`;

export const LogoLink = styled(DropdownLink)`
  grid-area: logo;
  padding: 0;
  color: ${props => props.theme.text.placeholder};

  > div:last-of-type {
    opacity: 1;
    display: inline-block;
  }

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const PricingLink = styled(DropdownLink)`
  grid-area: pricing;
  border: none;
`;

export const SupportLink = styled(DropdownLink)`
  grid-area: support;
  border-top: 2px solid ${props => props.theme.bg.border};
`;

export const ExploreLink = styled(DropdownLink)`
  grid-area: explore;
  border-top: 2px solid ${props => props.theme.bg.border};
`;

export const AuthLink = styled(DropdownLink)`
  grid-area: auth;
  margin: 0;
  padding: 16px;
  font-weight: 700;
  border-top: none;
  color: ${props => props.theme.text.reverse};
  background-color: ${props => props.theme.brand.alt};
  background-image: ${props =>
    Gradient(props.theme.brand.alt, props.theme.brand.default)};

  > div > div {
    box-shadow: 0 0 0 2px ${props => props.theme.bg.default};
  }

  &:hover {
    color: ${props => props.theme.text.reverse};
    text-shadow: 0 0 32px ${props => hexa(props.theme.text.reverse, 0.5)};
  }

  > div:first-of-type {
    grid-area: icon;
  }

  > span {
    grid-area: label;
  }

  > div:last-of-type {
    grid-area: arrow;
  }
`;

export const MenuContainer = styled.div`
  position: fixed;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 16px repeat(3, auto) 1fr auto;
  grid-template-areas: 'logo' '.' 'pricing' 'support' 'explore' '.' 'auth';
  align-content: start;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  width: 300px;
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
    display: ${props => (props.open ? 'grid' : 'none')};
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

export const Feature = styled.li`
  text-indent: -18px;
  font-weight: 400;

  a {
    font-weight: 500;
    text-decoration: underline;
    color: ${props => props.theme.brand.alt};
  }

  b {
    font-weight: 700;
  }

  + li {
    margin-top: 8px;
  }

  &:before {
    content: '+';
    margin-right: 8px;
    font-weight: 700;
    color: ${props => props.theme.text.placeholder};
  }
`;

export const FeatureList = styled.ul`
  padding-left: 24px;
  list-style: none;
  font-size: 16px;
  font-weight: 500;
`;

export const Layout = styled.div`
  flex: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr;
  grid-template-areas: 'pricing';
  justify-items: stretch;
  z-index: ${zIndex.background + 1};

  @media (max-width: 768px) {
    grid-template-columns: 100%;
    grid-template-rows: 1fr;
    grid-template-areas: 'pricing';
    margin: 32px 0 -80px;
  }
`;

export const PricingGrid = styled.div`
  grid-area: pricing;
  display: grid;
  grid-template-columns: minmax(auto, 400px) minmax(auto, 400px);
  grid-template-rows: auto auto;
  grid-row-gap: 32px;
  grid-column-gap: 64px;
  grid-template-areas: 'view-title view-title' 'free pro';
  justify-self: center;

  @media (max-width: 768px) {
    grid-template-columns: 100%;
    grid-template-rows: auto auto auto;
    grid-row-gap: 0;
    grid-column-gap: 0;
    grid-template-areas: 'view-title' 'free' 'pro';
    margin-right: 0;
    transform: none;
  }
`;
export const Plan = styled.div`padding: 40px 32px 32px;`;

export const CostNumber = styled.h2`
  font-weight: 900;
  font-size: 72px;
  letter-spacing: -2px;
  vertical-align: baseline;
  position: relative;

  &:before {
    content: '$';
    vertical-align: top;
    position: absolute;
    top: 24px;
    right: calc(100% + 4px);
    font-weight: 500;
    font-size: 20px;
    letter-spacing: normal;
    color: ${props => props.theme.text.placeholder};
  }

  &:after {
    content: ${props => (props.per ? `'/ ${props.per}'` : `''`)};
    position: absolute;
    font-size: 14px;
    white-space: nowrap;
    left: calc(100% + 4px);
    bottom: 24px;
    font-weight: 700;
    letter-spacing: normal;
    color: ${props => props.theme.text.placeholder};
  }
`;

export const Free = styled(Plan)`
  grid-area: free;
  color: ${props => props.theme.text.default};
  position: relative;

  &:after {
    content: '';
    z-index: -1;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${props => props.theme.bg.default};
    box-shadow: 0 8px 32px ${props => hexa(props.theme.brand.alt, 0.35)};
    transform: rotateX(10deg) rotateY(15deg);

    @media (max-width: 768px) {
      box-shadow: none;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    padding-top: 16px;
  }

  ${CostNumber} {
    &:before {
      content: '';
    }
  }
`;

export const Cost = styled(FlexCol)`
  align-items: center;
  text-align: center;
`;

export const Description = styled.p`
  font-size: 16px;
  font-weight: 400;
  margin: 16px 0;
  border-top: 2px solid ${({ theme }) => theme.bg.border};
  border-bottom: 2px solid ${({ theme }) => theme.bg.border};
  padding: 16px 8px;
`;

export const Paid = styled(Plan)`
  grid-area: pro;
  color: ${props => props.theme.text.reverse};

  position: relative;

  &:after {
    content: '';
    z-index: -1;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${props => props.theme.brand.default};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    box-shadow: 0 8px 32px ${props => hexa(props.theme.brand.alt, 0.35)};
    transform: rotateX(-10deg) rotateY(15deg);

    @media (max-width: 768px) {
      box-shadow: none;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    padding-top: 16px;
  }

  @media (max-width: 768px) {
    box-shadow: none;
    margin-top: 32px;
    box-shadow: none;
    transform: none;
  }

  ${CostNumber} {
    left: -16px;

    &:before,
    &:after {
      color: ${props => props.theme.brand.border};
    }
  }

  ${Description} {
    font-weight: 500;
    border-color: ${props => props.theme.brand.alt};
  }

  ${Feature} {
    font-weight: 400;

    a {
      font-weight: 700;
      color: inherit;
    }

    b {
      font-weight: 900;
    }

    &:before {
      color: ${props => hexa(props.theme.brand.border, 0.5)};
    }
  }
`;

export const Title = styled.h1`
  text-align: center;
  font-weight: 700;
`;

export const CostPer = styled.span`
  position: relative;
  left: -12px;
  font-weight: 500;
  letter-spacing: normal;
`;

export const CostSubtext = styled(FlexCol)`
  margin-top: 8px;
  flex: 0 0 48px;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 700;
`;

export const PlanFooter = styled(FlexRow)`justify-content: center;`;

export const FreePrimaryCTA = styled(PrimaryCTA)`
  margin-top: 32px;
  background-color: ${props => props.theme.success.default};
  background-image: ${props =>
    Gradient(props.theme.success.alt, props.theme.success.default)};
  color: ${props => props.theme.text.reverse};

  &:hover {
    color: ${props => props.theme.text.reverse};
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.success.dark, 0.25)};
  }
`;

export const PaidPrimaryCTA = styled(PrimaryCTA)`
  margin-top: 32px;
  margin-bottom: 16px;

  &:hover {
    color: ${props => props.theme.brand.alt};
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.brand.dark, 0.75)};
  }

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;
