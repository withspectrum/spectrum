// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FlexRow,
  FlexCol,
  Truncate,
  Transition,
  zIndex,
  Shadow,
  hexa,
} from 'src/components/globals';
import { Button, OutlineButton } from 'src/components/button';
import { ReputationWrapper } from 'src/components/reputation/style';
import Icon from 'src/components/icon';
import Card from 'src/components/card';
import { MEDIA_BREAK } from 'src/components/layout';

export const ProfileHeader = styled(FlexRow)`
  padding: 16px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
`;

export const ProfileHeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex: auto;
  min-width: 0;

  &:hover h3 {
    transition: ${Transition.hover.on};
    color: ${theme.brand.alt};
  }
`;

export const ProfileHeaderNoLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex: auto;
  min-width: 0;

  &:hover h3 {
    transition: ${Transition.hover.on};
    color: ${theme.brand.alt};
  }
`;

export const ProfileHeaderMeta = styled(FlexCol)`
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
`;

export const ProfileHeaderAction = styled(Icon)`
  margin-left: 16px;
  flex: 0 0 auto;
`;

export const Title = styled.h3`
  font-size: 16px;
  color: ${theme.text.default};
  font-weight: 700;
  line-height: 1.2;
  transition: ${Transition.hover.off};
`;

export const FullTitle = styled(Title)`
  font-size: 24px;
  margin-top: 16px;
`;

export const FullProfile = styled.div`
  margin-left: 32px;
  margin-top: -64px;
  background-color: ${theme.bg.default};

  @media (max-width: ${MEDIA_BREAK}px) {
    margin-top: -48px;
  }
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: ${theme.text.alt};
  line-height: 1.2;
  margin-top: 4px;

  ${Truncate};

  overflow: visible;

  > ${ReputationWrapper} {
    margin-left: 8px;

    span {
      font-size: 16px;
    }
  }
`;

export const Description = styled.div`
  font-size: 16px;
  color: ${theme.text.alt};
  padding: 0 16px 16px;
  line-height: 1.4;
  white-space: pre-wrap;

  a {
    font-weight: 500;
    color: ${theme.brand.alt};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FullDescription = styled.div`
  padding: 0;
  margin-top: 16px;
  color: ${theme.text.alt};

  p {
    white-space: pre-wrap;
    margin-bottom: 24px;
  }

  a {
    color: ${theme.text.secondary};
  }

  a:hover {
    color: ${theme.text.default};
    text-decoration: none;
  }

  > ${ReputationWrapper} {
    margin-top: 0px;

    span {
      margin-left: 4px;
      font-size: 16px;
      font-weight: 400;
    }
  }
`;

export const Actions = styled(FlexRow)`
  padding: 16px;
  padding-top: 0;
  flex: 1 0 100%;
  justify-content: flex-end;
`;

export const Action = styled(Button)`
  &:last-of-type:not(:first-of-type) {
    margin-left: 8px;
  }
`;

export const ActionOutline = styled(OutlineButton)`
  flex-grow: 1;

  &:last-of-type:not(:first-of-type) {
    margin-left: 8px;
  }
`;

export const Meta = styled.div`
  background: #f8fbfe;
  border-top: 2px solid ${theme.bg.border};
  padding: 8px 16px;
  width: 100%;
  border-radius: 0 0 4px 4px;
`;

export const MetaList = styled.ul``;

export const MetaListItem = styled.li`
  list-style-type: none;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.alt};
  padding: 8px 0;
  border-top: 2px solid ${theme.bg.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:first-child {
    border-top: none;
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

export const Label = styled.span`
  display: flex;
  align-items: center;

  /* icon */
  div {
    margin-right: 8px;
  }
`;

export const Count = styled.span`
  font-weight: 500;
`;

export const CoverLink = styled(ProfileHeaderLink)`
  flex: none;
  margin-top: -32px;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
`;

export const CoverTitle = styled(Title)`
  font-size: 20px;
  margin-top: 16px;
  text-align: center;
`;

export const CoverSubtitle = styled(Subtitle)`
  text-align: center;
  margin-bottom: 16px;
  justify-content: center;
`;

export const CoverDescription = styled(Description)`
  flex: auto;
  margin-top: 8px;
`;

// had a hard time targeting the ChannelListItem component, so this is a janky way to get the overrides I needed.
export const ProfileCard = styled(Card)`
  > div:first-of-type,
  > a > div {
    padding: 16px;

    h4 > a:hover {
      color: ${theme.brand.alt};
      text-decoration: underline;
    }
  }
`;

export const ThreadProfileCard = styled(ProfileCard)`
  border-radius: 4px;
  box-shadow: ${Shadow.low} ${({ theme }) => hexa(theme.text.default, 0.1)};
`;

export const CoverPhoto = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.large ? '320px' : '96px')};
  background-color: ${theme.brand.default};
  background-image: url('${props => props.url}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${props => (props.large ? '4px' : '4px 4px 0 0')};
`;

export const Container = styled.div`
  background: ${theme.bg.default};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex: 0 0 22%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  position: relative;
  z-index: ${zIndex.card};
  margin: 16px;

  @media (max-width: 1168px) {
    flex-basis: 44%;
  }

  @media (max-width: 540px) {
    flex-basis: 100%;
  }
`;

export const ButtonContainer = styled.div`
  padding: 8px 16px 16px;

  button {
    width: 100%;
  }
`;

export const MessageButtonContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0 8px 8px;
  align-items: stretch;

  a,
  button {
    width: 100%;
    display: flex;
    flex: auto;
    justify-content: center;
    text-align: center;
  }
`;
