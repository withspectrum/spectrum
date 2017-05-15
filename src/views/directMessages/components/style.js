import styled from 'styled-components';
import {
  Truncate,
  FlexCol,
  FlexRow,
  H3,
  H4,
  P,
} from '../../../components/globals';

export const Wrapper = styled(FlexCol)`
  flex: 0 0 auto;
  justify-content: center;
  max-width: 100%;
  position: relative;
  background: ${props => (props.active ? props.theme.bg.wash : '#fff')};

  a {
    padding: 16px;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    width: calc(100% - 16px);
    border-bottom: 1px solid ${props => props.theme.bg.wash};
  }

  &:first-of-type a {
    padding-top: 16px;
  }

  &:last-of-type a {
    padding-bottom: 16px;

    &:after {
      display: none;
    }
  }

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.bg.wash};
  }
`;

export const Col = styled(FlexCol)`
  flex: 1;
`;

export const Row = styled(FlexRow)`
  flex: 0 0 auto;
  align-items: center;

  a {
    display: flex;
    align-items: center;
  }
`;

export const Heading = styled(H3)`
  font-weight: 700;
`;

export const Meta = styled(H4)`
  font-weight: 400;
  color: ${({ theme }) => theme.text.alt};

  ${props => (props.nowrap ? Truncate() : '')}
`;

export const Description = styled(P)`
  margin-top: 8px;
  font-weight: 400;
  color: ${({ theme }) => theme.text.default};
`;

export const MessageGroupTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 0 calc(100% - 64px);
	overflow: hidden;
`;

export const MessageGroupByline = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: baseline;
`;

export const Usernames = styled.span`
	display: flex;
	overflow: hidden;
	flex-wrap: nowrap;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }) => theme.text.default};
	font-weight: ${props => (props.unread ? 800 : 600)};
	line-height: 1.2;
	margin-bottom: 2px;
	font-size: 14px;
	flex: 1 1 100%;

	p {
		${Truncate()}
	}
`;

export const Timestamp = styled.span`
	font-size: 12px;
	text-align: right;
	color: ${props => (props.unread ? props.theme.brand.default : '#909aa7')};
	padding-right: 4px;
	display: inline-block;
	flex: 1 0 auto;
	margin-left: 8px;
`;

export const Snippet = styled.p`
	font-size: 13px;
	font-weight: ${props => (props.unread ? 700 : 500)};
	color: ${props => (props.unread ? props.theme.text.default : props.theme.text.alt)};
	padding-right: 4px;
	display: inline-block;
	line-height: 1.3;
	margin-top: 0;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const AvatarContainer = styled.div`
  margin-right: 16px;
  width: 44px;
  height: 44px;

  img {
    box-shadow: 0 0 0 2px #fff;
  }
`;

export const TwoAvatarContainer = styled(AvatarContainer)`
  width: 60px;
  height: 60px;
  position: relative;

  img {
    margin: 1px;

    &:first-child {
      position: absolute;
      z-index: 2;
      top: 8px;
      left: 0;
    }

    &:last-child {
      position: absolute;
      z-index: 3;
      bottom: 0;
      right: 0;
    }
  }
`;

export const ThreeAvatarContainer = styled(AvatarContainer)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  img {
    margin: 1px;

    &:last-child {
      margin-top: 0;
    }
  }
`;

export const Remainder = styled.span`
  border-radius: 19px;
  width: 19px;
  height: 19px;
  padding: 0 2px;
  font-size: 9px;
  font-weight: 700;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  margin: 2px 1px 1px 2px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;
