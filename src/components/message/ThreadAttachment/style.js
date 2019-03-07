// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { tint, zIndex } from 'src/components/globals';

export const Container = styled.div`
  position: relative;
  list-style-type: none;
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};
  border-radius: 0px;
  background: ${theme.bg.default};
  padding: 8px 12px;
  z-index: 0;
  display: flex;

  a {
    text-decoration: none;
  }

  > a {
    display: block;
    padding: 8px 12px;
  }

  &:hover {
    background: ${tint(theme.bg.wash, 1)};
  }

  &:only-child {
    border-radius: 4px;
    border-top: 1px solid ${theme.bg.border};
    border-bottom: 1px solid ${theme.bg.border};
    margin: 8px 0;
  }

  &:not(:first-child):not(:last-child) {
    border-top: 1px solid ${theme.bg.border};
  }

  &:first-child:not(:last-child) {
    border-radius: 4px 4px 0 0;
    border-top: 1px solid ${theme.bg.border};
    margin-top: 8px;
  }

  &:last-child:not(:first-child) {
    border-radius: 0 0 4px 4px;
    border-bottom: 1px solid ${theme.bg.border};
    border-top: 1px solid ${theme.bg.border};
    margin-bottom: 8px;
  }
`;
export const LinkWrapper = styled(Link)`
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.card};

  &:hover {
    cursor: pointer;
  }
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AvatarWrapper = styled.div`
  padding-top: 4px;
  margin-right: 12px;
`;
