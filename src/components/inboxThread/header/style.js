// @flow
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { zIndex } from 'src/components/globals';

export const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
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

const metaTitleStyles = css`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.default};
  pointer-events: auto;
  position: relative;
  z-index: ${zIndex.card};

  &:hover {
    cursor: pointer;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const MetaTitle = styled(Link)`
  ${metaTitleStyles};
`;

export const MetaTitleText = styled.span`
  ${metaTitleStyles} &:hover {
    cursor: auto;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.alt};
  }
`;

const metaSubtitleStyles = css`
  font-size: 15px;
  font-weight: 400;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  line-height: 1.2;
  pointer-events: auto;
  position: relative;
  z-index: ${zIndex.card};

  &:hover {
    cursor: pointer;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.default};
  }
`;

export const MetaSubtitle = styled(Link)`
  ${metaSubtitleStyles};
`;

export const MetaSubtitleText = styled.span`
  display: flex;

  ${metaSubtitleStyles} &:hover {
    cursor: auto;
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.alt};
  }
`;

export const Timestamp = styled(MetaTitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  font-weight: 400;
`;

export const NewThreadTimestamp = styled(MetaSubtitleText)`
  margin-left: 4px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.brand.default};
`;

export const MetaSubtitlePinned = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.special.default};

  &:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.special.default};
  }
`;

export const MetaSubtitleLocked = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.secondary};

  &:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.text.secondary};
  }
`;

export const MetaSubtitleWatercooler = styled(MetaSubtitleText)`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.space.default};

  &:hover {
    color: ${props =>
      props.active ? props.theme.text.reverse : props.theme.space.default};
  }
`;

export const Divider = styled.span`
  margin: 0 4px;
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
