// @flow
import theme from 'shared/theme';
import compose from 'recompose/compose';
import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Transition, zIndex } from 'src/components/globals';
import { UserHoverProfile } from 'src/components/hoverProfile';
import type { Node } from 'react';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { MEDIA_BREAK } from 'src/components/layout';

const UsernameWrapper = styled.span`
  color: ${props =>
    props.me
      ? props.theme.special.default
      : props.theme.space.default}!important;
  background: ${props =>
    props.me ? props.theme.special.wash : props.theme.space.wash}!important;
  padding: 0px 4px 1px;
  border-radius: 4px;
  position: relative;
  display: inline-block;
  line-height: 1.4;
  &:hover {
    text-decoration: underline;
  }
  a {
    color: inherit !important;
    text-decoration: none !important;
  }
`;

type MentionProps = {
  children: Node,
  username: string,
  currentUser: ?Object,
};

class MentionWithCurrentUser extends React.Component<MentionProps> {
  render() {
    const { username, currentUser, children } = this.props;
    const me = currentUser && currentUser.username === username;
    return (
      <UsernameWrapper me={me}>
        <UserHoverProfile username={username}>
          <Link to={`/users/${username}`} onClick={e => e.stopPropagation()}>
            {children}
          </Link>
        </UserHoverProfile>
      </UsernameWrapper>
    );
  }
}

export const Mention = compose(
  withCurrentUser,
  connect()
)(MentionWithCurrentUser);

export const customStyleFn = (style: Object, block: Object) => {
  if (style.first() === 'CODE' && block.getType() === 'unstyled')
    return {
      border: `1px solid ${theme.bg.border}`,
      borderRadius: '4px',
      backgroundColor: theme.bg.wash,
      padding: '1px 4px',
      fontFamily: 'monospace',
      color: theme.warn.alt,
    };
  return style;
};

export const customStyleMap = {
  blockquote: {
    lineHeight: '1.5',
    borderLeft: `4px solid ${theme.bg.border}`,
    color: `${theme.text.alt}`,
    padding: '4px 12px 4px 16px',
  },
};

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  cursor: text;

  .DraftEditor-root {
    margin-top: 0;
  }
`;

export const MediaRow = styled.div`
  display: flex;
  background: ${theme.bg.wash};
  border-top: 2px solid ${theme.bg.border};
  padding: 8px 16px;
  margin-left: -24px;
  margin-bottom: -24px;
  margin-top: 16px;
  width: calc(100% + 48px);

  @media (max-width: ${MEDIA_BREAK}px) {
    position: absolute;
    top: calc(100% - 90px);
  }
`;

export const ComposerBase = styled.div`
  position: relative;
  flex: 1;
  max-height: ${props => (props.isOpen ? 'calc(100vh - 160px)' : 'auto')};
  overflow-y: ${props => (props.isOpen ? 'scroll' : 'auto')};
  padding-left: ${props => (props.isOpen ? '25px' : '0')};

  > label {
    position: absolute;
    right: calc(100% + 8px);
    top: auto;
    bottom: -11px;
    padding: 0;
    margin: 0;
    color: ${theme.text.placeholder};
  }
`;

export const SideToolbarWrapper = styled.div`
  position: fixed;
  margin-top: -8px;
  z-index: ${zIndex.composerToolbar};
`;

export const Action = styled.div`
  display: ${props => (props.embedding ? 'flex' : 'none')};
  flex: 0 0 40px;
  flex-direction: column;
  height: 40px;
  max-height: 40px;
  justify-content: center;
  align-items: flex-start;
  position: relative;

  label > div,
  label > button > div {
    color: ${theme.text.reverse};
  }
`;

export const Expander = styled.div`
  display: inline-block;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 4px;
  border-radius: 12px;
  margin-left: 5px;

  > button > div {
    color: ${theme.text.placeholder};
    background-color: white;
    border-radius: 12px;
  }

  > button:hover > div {
    color: ${theme.brand.alt};
  }

  ${props =>
    props.inserting &&
    css`
      background-color: ${theme.brand.alt};
      transition: ${Transition.hover.on};

      > button > div {
        color: ${theme.brand.wash};
        background-color: transparent;
      }

      > button:hover > div {
        color: ${theme.brand.wash};
      }

      ${Action} {
        display: flex;
      }
    `};
`;

export const EmbedUI = styled.form`
  display: flex;
  flex-direction: row;
  background-color: ${theme.brand.alt};
  border-radius: 12px;

  label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
  }

  input,
  button {
    display: none;
  }

  ${props =>
    props.embedding &&
    css`
      position: relative;
      z-index: ${zIndex.chrome};
      left: -4px;

      label {
        padding: 4px;

        > div:after,
        > div:before {
          display: none;
        }
      }

      input {
        display: inline-block;
        height: 28px;
        padding: 0 8px;
        border-radius: 8px;
        line-height: 1;
        font-size: 14px;
        margin-left: 4px;
        margin-right: 8px;
        width: 240px;
      }

      button {
        display: inline-block;
        background-color: transparent;
        color: ${theme.text.reverse};
        margin-right: 16px;
        font-size: 14px;
        line-height: 1;
        font-weight: 700;
        cursor: pointer;
        transition: ${Transition.hover.off};

        &:hover {
          background-color: ${theme.brand.dark};
          border-radius: 8px;
          transition: ${Transition.hover.on};
        }
      }
    `};
`;

export const EmbedContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
`;

export const AspectRatio = styled(EmbedContainer)`
  padding-bottom: ${props => (props.ratio ? props.ratio : '0')};
`;

export const EmbedComponent = styled.iframe`
  position: absolute;
  height: 100%;
  width: 100%;
`;
