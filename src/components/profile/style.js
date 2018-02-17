import styled from 'styled-components';
import Link from 'src/components/link';
import {
  FlexRow,
  FlexCol,
  Truncate,
  Transition,
  zIndex,
  Shadow,
  hexa,
} from '../globals';
import { Button, OutlineButton, IconButton } from '../buttons';
import { ReputationWrapper } from '../reputation/style';
import Card from '../card';
import { Heading } from '../listItems/style';

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
    color: ${props => props.theme.brand.alt};
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
    color: ${props => props.theme.brand.alt};
  }
`;

export const ProfileHeaderMeta = styled(FlexCol)`
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
`;

export const ProfileHeaderAction = styled(IconButton)`
  margin-left: 16px;
  flex: 0 0 auto;
`;

export const Title = styled.h3`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  line-height: 1.2;
  transition: ${Transition.hover.off};
`;

export const FullTitle = styled(Title)`
  font-size: 24px;
  margin-top: 8px;
`;

export const FullProfile = styled.div`
  margin-left: 32px;
  margin-top: -64px;
  background-color: ${props => props.theme.bg.default};

  ${Heading} {
    font-size: 16px;
    color: ${props => props.theme.text.alt};
  }

  @media (max-width: 768px) {
    margin-top: -48px;
  }
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: ${props => props.theme.text.alt};
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
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  padding: 0 16px 16px;
  line-height: 1.4;
  white-space: pre-wrap;

  a {
    font-weight: 500;
    color: ${props => props.theme.brand.alt};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FullDescription = styled.div`
  padding: 0;
  margin-top: 16px;
  color: ${props => props.theme.text.alt};

  > ${ReputationWrapper} {
    margin-top: 16px;

    span {
      margin-left: 4px;
      font-size: 16px;
      font-weight: 400;
    }
  }
`;

export const ExtLink = styled(FlexRow)`
  align-items: center;
  color: ${({ theme }) => theme.brand.alt};
  font-weight: 600;
  transition: ${Transition.hover.off};
  ${Truncate};
  font-size: 16px;
  margin: 12px 0;

  > a:hover {
    text-decoration: underline;
    transition: ${Transition.hover.on};
  }

  > div {
    color: ${({ theme }) => theme.text.alt};
    margin-right: 4px;
    margin-top: 1px;
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
  border-top: 2px solid ${props => props.theme.bg.border};
  padding: 8px 16px;
  width: 100%;
  border-radius: 0 0 12px 12px;
`;

export const MetaList = styled.ul``;

export const MetaListItem = styled.li`
  list-style-type: none;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  padding: 8px 0;
  border-top: 2px solid ${props => props.theme.bg.border};
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
  font-weight: 700;
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
  margin-top: 8px;
  text-align: center;
`;

export const CoverSubtitle = styled(Subtitle)`
  text-align: center;
  margin-bottom: 16px;
  justify-content: center;
`;

export const CoverDescription = styled(Description)`
  text-align: center;
  flex: auto;
`;

// had a hard time targeting the ChannelListItem component, so this is a janky way to get the overrides I needed.
export const ProfileCard = styled(Card)`
  > div:first-of-type,
  > a > div {
    padding: 16px;

    h4 > a:hover {
      color: ${({ theme }) => theme.brand.alt};
      text-decoration: underline;
    }
  }
`;

export const ProUpgrade = styled.div`
  margin: 16px;
  margin-top: 0;
  display: flex;
  align-items: stretch;
  align-content: stretch;
  justify-content: center;

  button {
    width: 100%;
    text-align: center;
  }
`;

// export const ReputationContainer = styled.div`
//   border-top: 2px solid ${props => props.theme.bg.border};
//   padding: 12px 0;
//   margin: 0 16px;
//   display: flex;
//   color: ${props => props.theme.text.alt};
// `;

export const CoverPhoto = styled.div`
  position: relative;
  width: 100%;
  height: ${props => (props.large ? '320px' : '96px')};
  background-color: ${({ theme }) => theme.brand.default};
  background-image: url('${props => props.url}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: ${props => (props.large ? '12px' : '12px 12px 0 0')};
`;

export const Container = styled.div`
  background: ${props => props.theme.bg.default};
  box-shadow: ${Shadow.mid} ${props => hexa(props.theme.bg.reverse, 0.15)};
  flex: 0 0 22%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
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
