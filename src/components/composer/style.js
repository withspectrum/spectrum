import styled, { keyframes } from 'styled-components';
import { Card } from '../card';
import { Transition, hexa, Shadow, FlexRow, FlexCol, zIndex } from '../globals';

export const Container = styled(FlexCol)`
  display: grid;
  grid-template-rows: 48px 1fr 48px;
  grid-template-columns: 1fr;
  grid-template-areas: 'header' 'body' 'footer';
  align-self: stretch;
  height: 100%;
`;

export const Actions = styled(FlexCol)`
  grid-area: footer;
  background: ${props => props.theme.bg.wash};
  border-top: 2px solid ${props => props.theme.bg.border};
  padding: 8px 8px 8px 0;
  border-radius: 0 0 12px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    position: absolute;
    bottom: 0;
    flex-direction: column;
    align-items: flex-end;
    padding: 8px;
  }
`;

export const Dropdowns = styled(FlexRow)`
  display: flex;
  align-items: center;
  grid-area: header;
  background-color: ${props => props.theme.bg.wash};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
  z-index: ${zIndex.composer};

  span {
    font-size: 14px;
    color: ${props => props.theme.text.alt};
    margin-left: 16px;
    line-height: 1;
    vertical-align: middle;
    position: relative;
    top: 1px;
  }

  select:first-of-type {
    max-width: 224px;
    display: block;
    padding: 8px 12px;
    border: none;
    border: 2px solid ${props => props.theme.bg.border};
    border-radius: 8px;
    box-shadow: none;
    color: ${props => props.theme.text.default};
    font-weight: 600;
    font-size: 14px;
    box-sizing: border-box;
    background-color: #fff;
    background-image: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    margin-left: 8px;
  }

  select:last-of-type {
    color: ${props => props.theme.text.alt};
    font-weight: 600;
    font-size: 14px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    margin-left: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 8px;

    select:nth-of-type(2) {
        flex: 1 0 auto;
        margin-left: 4px;
      }
    }
  }
`;

export const ComposerUpsell = styled.div`
  position: relative;
  padding: 4px 16px;
  background: ${props => props.theme.brand.alt};
  border-bottom: 2px solid ${props => props.theme.brand.alt};
  color: #fff;
  text-align: center;
  border-radius: 12px 12px 0 0;

  p {
    font-size: 14px;
    font-weight: 700;
  }
`;

export const UpsellPulse = styled.div`
  width: 10px;
  height: 10px;
  border: 5px solid ${props => props.theme.brand.alt};
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  background-color: ${props => props.theme.brand.alt};
  z-index: ${zIndex.composer};
  position: absolute;
  top: -4px;
  left: -4px;
  box-shadow: 0 0 0 2px #fff;
`;

const pulse = keyframes`
  0% {
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    opacity: 0.0;
  }
  25% {
    -webkit-transform: scale(0);
      -moz-transform: scale(0);
      opacity: 0.1;
  }
  50% {
      -webkit-transform: scale(0.1);
      -moz-transform: scale(0.1);
      opacity: 0.3;
  }
  75% {
      -webkit-transform: scale(0.5);
      -moz-transform: scale(0.5);
      opacity: 0.5;
  }
  100% {
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      opacity: 0.0;
  }
`;

export const UpsellDot = styled.div`
  border: 10px solid ${props => props.theme.brand.default};
  background: transparent;
  -webkit-border-radius: 60px;
  -moz-border-radius: 60px;
  border-radius: 60px;
  height: 50px;
  width: 50px;
  -webkit-animation: ${pulse} 3s ease-out;
  -moz-animation: ${pulse} 3s ease-out;
  animation: ${pulse} 3s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  position: absolute;
  top: -24px;
  left: -24px;
  z-index: ${zIndex.composer};
  opacity: 0;
`;

export const ThreadInputs = styled(FlexCol)`
  grid-area: body;
  overflow: hidden;
  overflow-y: scroll;
  padding: 64px;
  padding-left: 80px;

  @media (max-width: 768px) {
    padding: 32px;
    padding-left: 40px;
  }

  @media (max-width: 480px) {
    padding: 8px;
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
