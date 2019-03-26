// @flow
import styled, { createGlobalStyle } from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { tint, zIndex } from 'src/components/globals';

export const Container = styled.div``;
export const LinkWrapper = styled(Link)``;
export const Column = styled.div``;
export const AvatarWrapper = styled.div``;

export const GlobalThreadAttachmentStyles = createGlobalStyle`
  .attachment-container {

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: ${theme.text.default};
      max-width: 100%;
      line-height: 1.4;
      margin-bottom: -4px;
      margin-top: 0;
    }

    img {
      border-radius: 100px;
    }

    ${Container} {
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
    }


    ${LinkWrapper} {
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
    }
    
    ${Column} {
      display: flex;
      flex-direction: column;
    }

    ${AvatarWrapper} {
      padding-top: 4px;
      margin-right: 12px;
    }
  }
`;
