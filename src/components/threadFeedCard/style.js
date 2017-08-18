import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FlexCol,
  FlexRow,
  Transition,
  Shadow,
  hexa,
  Gradient,
  zIndex,
} from '../globals';
import Card from '../card';

export const StyledThreadFeedCard = styled(Card)`
  padding: 16px 20px;
  margin-bottom: 16px;
  transition: ${Transition.hover.off};

  @media (max-width: 768px) {
    margin: 0;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.default, 0.1)};
  }
`;

export const CardLink = styled(Link)`
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.card};
`;

export const CardContent = styled(FlexCol)`
  align-self: flex-start;
  position: relative;
  z-index: ${zIndex.card + 1};
  align-items: flex-start;
  pointer-events: none;
  width: 100%;
`;

export const Title = styled.h2`
  font-weight: 800;
  font-size: 20px;
  line-height: 1.2;
  flex: 0 0 auto;
  color: ${({ theme }) => theme.text.default};
  pointer-events: all;
`;

export const MessageCount = styled(FlexRow)`
  align-self: flex-end;
  align-items: center;
  justify-content: flex-start;

  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  vertical-align: middle;
  color: ${({ theme }) => theme.text.alt};

  div {
    margin-right: 4px;
  }
`;

export const Attachments = styled(FlexRow)`
  align-self: stretch;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0 8px;
`;

export const CreatorName = styled.span`
  font-weight: 500;
  font-size: 13px;
  color: ${props => props.theme.text.alt};
  line-height: 1;
`;

export const ThreadContext = styled(FlexRow)`
  align-items: center;
  margin-bottom: 8px;
`;

export const ThreadContextAvatar = styled(FlexRow)`
  margin-right: 8px;
  align-items: center;
`;

export const ThreadContextMeta = styled(FlexCol)`
  justify-content: space-between;
  align-items: flex-start;
`;

export const Meta = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  vertical-align: middle;
  color: ${({ theme }) => theme.text.alt};
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  div {
    margin-right: 4px;
  }
`;

export const MetaNew = styled(Meta)`
  color: ${({ theme }) => theme.success.default};
  align-self: flex-end;
`;

export const Location = styled.span`
  display: inline-block;
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};
  line-height: 1;
  margin-bottom: 2px;

  > a {
    pointer-events: all;
  }

  > a:hover {
    color: ${({ theme }) => theme.brand.alt};
    text-decoration: underline;
  }
`;

export const Lock = styled.span`
  position: relative;
  color: ${props => props.theme.text.alt};
  top: 1px;
`;

export const Pinned = styled.span`
  position: absolute;
  top: -16px;
  right: -20px;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 0 12px 0 0;

  @media (max-width: 768px) {
    border-radius: 0;
  }
`;

export const PinnedBanner = styled.span`
  position: absolute;
  width: 72px;
  height: 72px;
  background-color: ${props => props.theme.special.default};
  background-image: ${props =>
    Gradient(props.theme.special.alt, props.theme.special.default)};
  transform: rotate(45deg);
  top: -36px;
  right: -36px;
`;

export const PinnedIconWrapper = styled.span`
  position: relative;
  right: -36px;
  top: 4px;
  color: ${props => props.theme.text.reverse};
`;

export const ParticipantHeads = styled(FlexRow)`
  align-items: center;

  > *:not(:first-child) {
    margin-left: 4px;
    pointer-events: auto;
  }
`;

export const ParticipantCount = styled.span`
  display: inline-block;
  border-radius: 100%;
  height: 32px;
  width: 32px;
  color: ${props => props.theme.text.reverse};
  background-color: ${props => props.theme.text.alt};
  font-size: 11px;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  text-overflow: clip;
`;

export const Creator = styled.div`
  padding: 2px;
  border-radius: 100%;
  border: 2px solid ${({ theme }) => theme.brand.alt};
  pointer-events: all;
  display: flex;
  flex: none;
  justify-content: center;
  align-items: center;

  > div:after,
  > a > div:after {
    right: -3px;
    bottom: -2px;
  }
`;

export const ContentInfo = styled(FlexRow)`
  margin-top: 8px;
  justify-content: space-between;
  flex: none;
  align-self: stretch;
  align-items: center;
`;
