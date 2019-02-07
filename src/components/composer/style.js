import React from 'react';
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import Icon from '../icons';
import { hexa, Shadow, FlexRow, FlexCol, zIndex, Tooltip } from '../globals';

export const DropzoneWrapper = styled.div`
  padding: 0 32px;
  position: relative;
  height: 100%;
`;

export const DropImageOverlay = (props: { visible: boolean }) => {
  return (
    <DropImageOverlayWrapper visible={props.visible}>
      <Icon glyph="photo" />
      <h3>Drop image to upload</h3>
    </DropImageOverlayWrapper>
  );
};

export const DropImageOverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: ${theme.bg.wash};
  border-radius: 4px;
  border: 1px solid ${theme.bg.border};
  color: ${theme.text.secondary};
  transition: opacity 125ms ease-in-out;

  ${props =>
    props.visible
      ? css`
          opacity: 0.9;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

export const Container = styled(FlexCol)`
  background-color: ${theme.bg.default};
  display: grid;
  grid-template-rows: 60px 1fr 64px;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'body' 'footer';
  align-self: stretch;
  flex: auto;
  overflow: hidden;
  height: calc(100vh - 48px);

  @media (max-width: 768px) {
    grid-template-rows: 48px 64px 1fr 100px;
    grid-template-areas: 'title' 'header' 'body' 'footer';
    max-width: 100vw;
    height: 100vh;
  }
`;

export const Actions = styled(FlexCol)`
  background: ${theme.bg.wash};
  border-top: 2px solid ${theme.bg.border};
  padding: 8px 32px;
  border-radius: 0;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  grid-area: footer;

  @media (max-width: 768px) {
    padding: 8px;
    z-index: ${zIndex.chrome + 1};
    border-radius: 0;
    border: 0;
    box-shadow: none;
    background-color: transparent;
    flex-direction: column;

    > div {
      width: 100%;

      > button:first-of-type {
        display: none;
      }

      > button:last-of-type {
        width: 100%;
      }
    }
  }
`;

export const InputHints = styled(FlexRow)`
  color: ${theme.text.alt};
  font-size: 14px;
`;

export const Dropdowns = styled(FlexRow)`
  display: flex;
  align-items: center;
  grid-area: header;
  background-color: ${theme.bg.wash};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
  z-index: ${zIndex.composer};
  grid-area: header;

  span {
    font-size: 14px;
    font-weight: 500;
    color: ${theme.text.alt};
    margin-left: 16px;
    line-height: 1;
    vertical-align: middle;
    position: relative;
    top: 1px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const Selector = styled.select`
  max-width: 196px;
  display: inline-block;
  flex: none;
  border: none;
  box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  margin-left: 8px;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;

  @media (max-width: 768px) {
    flex: auto;
    max-width: calc(50% - 12px);
  }
`;

export const RequiredSelector = styled(Selector)`
  padding: 8px 12px;
  border: 2px solid ${theme.bg.border};
  border-radius: 8px;
  color: ${theme.text.default};
  background-color: ${theme.bg.default};
`;

export const OptionalSelector = styled(Selector)`
  color: ${theme.text.alt};
  margin-left: 16px;
  background-color: transparent;
`;

export const ThreadInputs = styled(FlexCol)`
  grid-area: body;
  overflow-y: scroll;
  padding: 32px;
  padding-top: 8px;
  margin-left: -32px;
  margin-right: -32px;
  width: calc(100% + 64px);
  background-color: ${theme.bg.default};
`;

export const ThreadTitle = {
  fontSize: '28px',
  padding: '0',
  outline: 'none',
  border: '0',
  lineHeight: '1.3',
  fontWeight: '600',
  boxShadow: 'none',
  width: '100%',
  color: '#16171A',
  whiteSpace: 'pre-wrap',
  minHeight: '34px',
  flex: 'none',
  display: 'inline-block',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Helvetica', 'Segoe', sans-serif",
};

export const ThreadDescription = {
  fontSize: '16px',
  fontWeight: '400',
  width: '100%',
  display: 'inline-block',
  lineHeight: '1.5',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#16171A',
  whiteSpace: 'pre-wrap',
  overflowY: 'scroll',
  position: 'relative',
  // NOTE(@mxstbr): Magic value to make the margin between
  // the thread title and body match the preview
  marginTop: '12px',
};

export const DisabledWarning = styled.div`
  display: flex;
  flex: auto;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  background: ${props => hexa(props.theme.warn.default, 0.1)};
  color: ${theme.warn.default};
`;
