// @flow
import styled from 'styled-components';
import Link from 'src/components/link';

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const AuthorAvatarContainer = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

export const AvatarLink = styled(Link)`
  display: inline-block;
  height: 32px;
  width: 32px;
  margin-right: 12px;
  pointer-events: auto;
  border-radius: 4px;
  overflow: hidden;
`;

export const TextRow = styled.span`
  line-height: 1.3;
  display: flex;
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

export const MetaSubtitleText = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  line-height: 1.28;
  pointer-events: auto;
`;

export const MetaSubtitle = styled(Link)`
  font-size: 12px;
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
