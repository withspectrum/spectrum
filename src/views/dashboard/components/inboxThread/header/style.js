// @flow
import styled from 'styled-components';
import Link from 'src/components/link';

export const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 4px;
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export const AuthorAvatarContainer = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

export const TextRow = styled.span`
  display: flex;
  flex: 1 0 auto;
  width: 100%;
  align-items: center;
`;

export const MetaTitle = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  pointer-events: auto;

  &:hover {
    cursor: pointer;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const MetaSubtitleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  line-height: 1.28;
  pointer-events: auto;
`;

export const Timestamp = styled(MetaSubtitleText)``;

export const NewThreadTimestamp = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.success.default};
`;

export const NewMessagesTimestamp = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.warn.alt};
`;

export const MetaSubtitle = styled(Link)`
  font-size: 14px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  line-height: 1.28;
  pointer-events: auto;

  &:hover {
    cursor: pointer;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const MetaSubtitlePinned = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.special.default};
`;

export const MetaSubtitleLocked = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.secondary};
`;

export const MetaSubtitleWatercooler = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.space.default};
`;

export const Divider = styled.span`
  padding-left: 4px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.placeholder};
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: ${props => props.color(props.theme)};
  margin-right: 8px;
`;
