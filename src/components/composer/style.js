import styled from 'styled-components';
import { hexa, Shadow, FlexRow, FlexCol, zIndex } from '../globals';

export const Container = styled(FlexCol)`
  background-color: ${props => props.theme.bg.default};
  display: grid;
  grid-template-rows: 60px 1fr 64px;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'body' 'footer';
  align-self: stretch;
  flex: auto;
  overflow: hidden;
  height: calc(100vh - 48px);

  @media (max-width: 768px) {
    grid-template-rows: 48px 64px 1fr 64px;
    grid-template-areas: 'title' 'header' 'body' 'footer';
    max-width: 100vw;
    height: 100vh;
  }
`;

export const Actions = styled(FlexCol)`
  background: ${props => props.theme.bg.wash};
  border-top: 2px solid ${props => props.theme.bg.border};
  padding: 8px;
  border-radius: 0;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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

export const Dropdowns = styled(FlexRow)`
  display: flex;
  align-items: center;
  grid-area: header;
  background-color: ${props => props.theme.bg.wash};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
  z-index: ${zIndex.composer};
  grid-area: header;

  span {
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.text.alt};
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
  border: 2px solid ${props => props.theme.bg.border};
  border-radius: 8px;
  color: ${props => props.theme.text.default};
  background-color: ${props => props.theme.bg.default};
`;

export const OptionalSelector = styled(Selector)`
  color: ${props => props.theme.text.alt};
  margin-left: 16px;
  background-color: transparent;
`;

export const ThreadInputs = styled(FlexCol)`
  grid-area: body;
  overflow-y: scroll;
  padding: 64px;
  padding-left: 80px;
  background-color: ${props => props.theme.bg.default};

  @media (max-width: 768px) {
    max-width: 100vw;
    padding: 32px;
    padding-left: 48px;
  }

  @media (max-width: 480px) {
    max-width: 100vw;
    padding: 16px;
    padding-left: 48px;
  }
`;

export const ThreadTitle = {
  fontSize: '24px',
  padding: '0',
  outline: 'none',
  border: '0',
  lineHeight: '1.4',
  fontWeight: '800',
  boxShadow: 'none',
  width: '100%',
  color: '#16171A',
  whiteSpace: 'pre-wrap',
  minHeight: '34px',
  flex: 'none',
  display: 'inline-block',
};

export const ThreadDescription = {
  fontSize: '16px',
  fontWeight: '500',
  width: '100%',
  display: 'inline-block',
  lineHeight: '1.5',
  padding: '0 32px 32px',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#16171A',
  whiteSpace: 'pre-wrap',
  overflowY: 'scroll',
  position: 'relative',
};
