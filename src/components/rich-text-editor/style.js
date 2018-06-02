// @flow
import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import Link from 'src/components/link';
import { Transition, zIndex } from '../globals';
import theme from 'shared/theme';
import { Manager, Reference, Popper } from 'react-popper';
import HoverProfile from 'src/components/avatar/hoverProfile';
import { getUserByUsername } from 'shared/graphql/queries/user/getUser';
import type { Node } from 'react';

const MentionHoverProfile = getUserByUsername(
  props =>
    !props.data.user ? null : (
      <HoverProfile
        innerRef={props.innerRef}
        source={props.data.user.profilePhoto}
        user={props.data.user}
        style={props.style}
      />
    )
);

type MentionProps = {
  children: Node,
  username: string,
};

export class Mention extends React.Component<
  MentionProps,
  { hovered: boolean }
> {
  state = { hovered: false };
  hover = (val: boolean) => () => this.setState({ hovered: val });
  render() {
    const { username, children } = this.props;
    return (
      <span onMouseEnter={this.hover(true)} onMouseLeave={this.hover(false)}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <span ref={ref}>
                <Link to={`/users/${username}`}>{children}</Link>
              </span>
            )}
          </Reference>
          {this.state.hovered &&
            document.body &&
            createPortal(
              <Popper placement="top">
                {({ style, ref }) => (
                  <MentionHoverProfile
                    username={username}
                    innerRef={ref}
                    style={style}
                  />
                )}
              </Popper>,
              document.body
            )}
        </Manager>
      </span>
    );
  }
}

export const customStyleMap = {
  CODE: {
    border: `1px solid ${theme.bg.border}`,
    borderRadius: '4px',
    backgroundColor: theme.bg.wash,
    padding: '1px 4px',
    fontFamily: 'monospace',
    color: theme.warn.alt,
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
  background: ${props => props.theme.bg.wash};
  border-top: 2px solid ${props => props.theme.bg.border};
  padding: 8px 16px;
  margin-left: -24px;
  margin-bottom: -24px;
  margin-top: 16px;
  width: calc(100% + 48px);

  @media (max-width: 768px) {
    position: absolute;
    top: calc(100% - 90px);
  }
`;

export const ComposerBase = styled.div`
  position: relative;
  flex: none;
  flex-direction: column;
  display: flex;

  > label {
    position: absolute;
    right: calc(100% + 8px);
    top: auto;
    bottom: -11px;
    padding: 0;
    margin: 0;
    color: ${props => props.theme.text.placeholder};
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
    color: ${props => props.theme.text.reverse};
  }
`;

export const Expander = styled.div`
  display: inline-block;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 4px;
  border-radius: 12px;

  > button > div {
    color: ${props => props.theme.text.placeholder};
  }

  > button:hover > div {
    color: ${props => props.theme.brand.alt};
  }

  ${props =>
    props.inserting &&
    css`
      background-color: ${props => props.theme.brand.alt};
      transition: ${Transition.hover.on};

      > button > div {
        color: ${props => props.theme.brand.wash};
      }

      > button:hover > div {
        color: ${props => props.theme.brand.wash};
      }

      ${Action} {
        display: flex;
      }
    `};
`;

export const EmbedUI = styled.form`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.brand.alt};
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
        color: ${props => props.theme.text.reverse};
        margin-right: 16px;
        font-size: 14px;
        line-height: 1;
        font-weight: 700;
        cursor: pointer;
        transition: ${Transition.hover.off};

        &:hover {
          background-color: ${props => props.theme.brand.dark};
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
