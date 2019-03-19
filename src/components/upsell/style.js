// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { MEDIA_BREAK } from 'src/components/layout';
import {
  FlexRow,
  FlexCol,
  Transition,
  Shadow,
  hexa,
  zIndex,
} from 'src/components/globals';
import { Button } from 'src/components/button';

export const Title = styled.p`
  color: ${theme.text.default};
  width: 100%;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  margin-bottom: 8px;
  padding: 0;
  text-align: center;
  letter-spacing: 0.2px;
`;

export const CommunityUpsellTitle = styled(Title)`
  text-align: left;
  font-size: 20px;
`;

export const MiniTitle = styled(Title)`
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0 8px;
  }
`;

export const Subtitle = styled.p`
  width: 100%;
  color: ${theme.text.secondary};
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 16px;
  padding: 0 32px;
  text-align: center;

  b {
    font-weight: 700;
  }

  a {
    color: ${theme.brand.default};
  }

  li {
    margin-top: 8px;
    list-style-type: none;
  }
`;

export const CommunityUpsellSubtitle = styled(Subtitle)`
  text-align: left;
  padding: 0;
  font-size: 14px;
  color: ${theme.text.default};

  li {
    margin-top: 16px;
  }
`;

export const MiniSubtitle = styled(Subtitle)`
  font-weight: 600;
  color: ${theme.text.alt};
  font-size: 0.875rem;
  line-height: 1.4;
`;

export const SmallTitle = styled(Title)`
  font-size: 18px;
`;

export const LargeTitle = styled(Title)`
  font-size: 40px;
  font-weight: 900;
  letter-spacing: 0.3px;
  margin-bottom: 16px;
`;

export const SmallSubtitle = styled(Subtitle)`
  font-size: 15px;
`;

export const LargeSubtitle = styled(Subtitle)`
  font-size: 20px;
`;

export const Cost = styled(Subtitle)`
  margin-top: 8px;
  font-weight: bold;
`;

export const CommunityUpsellCost = styled(Cost)`
  text-align: left;
  padding: 0;
  margin-bottom: 32px;
`;

export const NullCol = styled(FlexCol)`
  background-color: transparent;
  background-size: 110% auto;
  background-repeat: ${props => (props.repeat ? 'repeat-y' : 'no-repeat')};
  background-position: ${props =>
    props.repeat ? 'center top' : 'center center'};
  width: 100%;
  height: auto;
  min-height: ${props => (props.noPadding ? '0' : '160px')};
  flex: 0 0 auto;
  padding: ${props => (props.noPadding ? '0' : '2rem')};
  justify-content: center;
  align-items: ${props => props.alignItems || 'center'};
  position: relative;
  align-self: center;

  > div {
    color: ${theme.text.alt};
    margin-bottom: 8px;
  }
`;

export const NullRow = styled(FlexRow)`
  background-image: url('/img/fills/${props =>
    props.bg ? `${props.bg}` : 'locked'}.svg');
  background-color: transparent;
  background-size: 110% auto;
  background-repeat: no-repeat;
  background-attachment: center;
  width: 100%;
  height: auto;
  padding: 1rem 15%;
`;

export const Profile = styled.div`
  position: relative;
  padding: 16px 0;

  .badge {
    position: absolute;
    top: 54px;
    left: 40px;
  }
`;

export const LargeEmoji = styled.div`
  display: flex;
  text-align: center;
  flex 1;
  padding: 16px 0 32px;
  font-size: 48px;
`;

export const UpsellIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  margin-top: 32px;
  color: ${theme.text.alt};
`;

export const SignupButton = styled(Button)`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.text.reverse};
  padding: 16px 88px;
  max-width: 100%;
  box-shadow: ${props =>
    `${Shadow.high} ${hexa(props.theme.bg.reverse, 0.15)}`};
  margin-top: 8px;
`;

export const SignupFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  font-size: 14px;
  color: ${theme.text.alt};
  font-weight: 500;
  border-top: 2px solid ${theme.bg.wash};
  margin-top: 40px;
  width: 100%;
`;

export const SigninLink = styled.span`
  color: ${theme.brand.default};
  margin-left: 6px;
  cursor: pointer;
`;

export const FullscreenContent = styled.div`
  width: 100%;
  max-width: ${MEDIA_BREAK}px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px 16px;
  flex: 1 0 auto;
`;

export const CodeOfConduct = styled.p`
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.alt};
  border-radius: 8px;
  margin-top: 64px;
  margin-left: 32px;
  margin-right: 32px;
  text-align: center;
  position: relative;
  z-index: ${zIndex.card + 1};

  a {
    color: ${theme.brand.default};
    font-weight: 600;
  }
`;

export const SigninButtonsContainer = styled.div`
  display: flex;
  padding-top: 48px;
  max-width: 100%;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding-top: 24px;
  }
`;

export const Col = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const SigninButton = styled.a`
  display: flex;
  flex-shrink: 1;
  z-index: ${zIndex.card + 1};
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
  margin: 16px;

  ${props =>
    props.after &&
    `
      &:after {
        content: 'Previously signed in with';
        position: absolute;
        top: -32px;
        font-size: 14px;
        font-weight: 600;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
        color: ${props.theme.text.alt};
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

  @media (max-width: ${MEDIA_BREAK}px) {
    margin: 16px 0;

    ${props =>
      props.after &&
      `
        margin: 48px 0 16px 0;
      `};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const ButtonTwitter = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.twitter.default : 'none'};
  color: ${props =>
    props.whitebg
      ? props.theme.social.twitter.default
      : props.preferred
      ? '#fff'
      : 'rgba(255,255,255,0.8)'};

  &:after {
    color: ${theme.social.twitter.default};
  }

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.twitter.default : '#fff'};
  }
`;

export const ButtonFacebook = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.facebook.default : 'none'};
  color: ${props =>
    props.whitebg
      ? props.theme.social.facebook.default
      : props.preferred
      ? '#fff'
      : 'rgba(255,255,255,0.8)'};

  &:after {
    color: ${theme.social.facebook.default};
  }

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.facebook.default : '#fff'};
  }
`;

export const ButtonGoogle = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.google.default : 'none'};
  color: ${props =>
    props.whitebg
      ? props.theme.social.google.default
      : props.preferred
      ? '#fff'
      : 'rgba(255,255,255,0.8)'};

  &:after {
    color: ${theme.social.google.default};
  }

  &:hover {
    color: ${props =>
      props.whitebg ? props.theme.social.google.default : '#fff'};
  }
`;

export const ShareInputContainer = styled.div`
  width: 100%;
  max-width: 528px;
  margin-top: 16px;
`;

export const JoinChannelContainer = styled.div`
  display: flex;
  border: 1px solid ${theme.bg.border};
  border-radius: 4px;
  padding: 8px;
  align-items: center;
  flex: 0 0 auto;
  width: calc(100% - 16px);
  margin-bottom: 12px;
  background: ${theme.bg.wash};
  position: relative;

  @media (max-width: ${MEDIA_BREAK}px) {
    button {
      width: 100%;
    }
  }
`;

export const JoinChannelContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  align-self: flex-start;
  width: 100%;
`;

export const HeadingIconWrapper = styled.div`
  display: flex;
  padding: 32px;
  align-items: center;
  justify-content: center;
  color: ${theme.text.alt};
`;
