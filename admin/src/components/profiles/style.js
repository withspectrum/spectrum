// @flow
import styled from 'styled-components';
import Link from '../../../src/components/link';
import { FlexRow, FlexCol, Truncate, Transition } from '../globals';
import { Avatar } from '../avatar';

export const ProfileHeader = styled(FlexRow)`
  padding: 16px;
  width: auto;
  min-width: 25%;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
`;

export const MiniProfileHeader = styled(FlexRow)`
  padding: 0px 16px;
  width: 100%;
  margin-left: 52px;
  margin-bottom: 24px;
`;

export const CommunityAvatar = styled(Avatar)`
  margin-right: 8px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

export const ProfileHeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex: auto;
  min-width: 0;
`;

export const ProfileHeaderMeta = styled(FlexCol)`
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
  margin-left: 12px;
`;

export const MiniProfileHeaderMeta = styled(FlexRow)`
  flex: 1 1 auto;
  flex-wrap: nowrap;
  min-width: 0;
  margin-left: 0px;
`;

export const Title = styled.h3`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  font-weight: 700;
  line-height: 1.2;
  transition: ${Transition.hover.off};

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const MiniTitle = styled.h3`
  font-size: 14px;
  color: ${props => props.theme.text.default};
  font-weight: 500;
  line-height: 1.2;
  transition: ${Transition.hover.off};
  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  line-height: 1.3;
  margin-top: 2px;
  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const MiniSubtitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${props => props.theme.text.alt};
  line-height: 1.3;
  margin-left: 8px;
  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const Description = styled(Subtitle)`
  margin-top: 8px;
`;
