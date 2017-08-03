// @flow
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FlexRow, FlexCol, Truncate, Transition } from '../globals';
import { Avatar } from '../avatar';

export const ProfileHeader = styled(FlexRow)`
  padding: 16px;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
`;

export const CommunityAvatar = styled(Avatar)`
  margin-right: 8px;
`;

export const ProfileHeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex: auto;
  min-width: 0;

  &:hover h3{
    transition: ${Transition.hover.on};
    color: ${props => props.theme.brand.alt};
  }
`;

export const ProfileHeaderMeta = styled(FlexCol)`
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
  margin-left: 12px;z
`;

export const Title = styled.h3`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  line-height: 1.2;
  transition: ${Transition.hover.off};
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  line-height: 1.3;

  ${Truncate} div {
    margin-right: 8px;
  }
`;
