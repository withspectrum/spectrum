import styled, { keyframes } from 'styled-components';
import { Transition, FlexRow, FlexCol, zIndex } from '../globals';

export const Container = styled(FlexRow)`
  align-self: stretch;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'block' : 'none')};
    position: fixed;
    height: calc(100vh - 56px);
    width: 100%;
    top: 8px;
    flex-direction: column;
    justify-content: flex-start;
    z-index: ${zIndex.composer};
  }
`;

export const Composer = styled.div`
  position: relative;
  z-index: ${props => (props.isInbox ? '3001' : zIndex.composer)};
  width: 100%;
  display: block;
  min-height: 64px;
  transition: ${Transition.hover.off};
  background-color: ${props => props.theme.bg.default};

  &:hover {
    transition: none;
  }

  @media (max-width: 768px) {
    width: calc(100% - 16px);
    margin: 48px 8px;
    height: calc(100% - 112px);
    min-height: 240px;
    pointer-events: all;
  }
`;

export const Overlay = styled.div`
  ${props =>
    props.isOpen
      ? `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: ${props.isInbox ? '3000' : zIndex.composer - 1};
      background: #000;
      pointer-events: auto;
      opacity: 0.4;
    `
      : `
      opacity: 0;
      pointer-events: none;

    `};
`;

export const Placeholder = styled.div`
  ${/* either the placeholder *or* the content container shows at a time. */ ''} display: ${props =>
      props.isOpen ? 'none' : 'flex'};
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  color: ${props => props.theme.text.alt};
  transition: ${Transition.hover.off};
  border-bottom: 1px solid ${props => props.theme.bg.border};

  &:hover {
    transition: ${Transition.hover.on};
    background-color: ${props => props.theme.bg.wash};
    color: ${props => props.theme.text.alt};
  }

  @media (max-width: 768px) {
    opacity: 0;
  }
`;

export const PlaceholderLabel = styled.h3`
  font-size: 20px;
  font-weight: 800;
  margin-left: 8px;
`;

export const ContentContainer = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

export const Actions = styled(FlexCol)`
  background: #f8fbfe;
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
  margin-bottom: 16px;

  select {
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

// these are style objects because i'm custom styling another react component to handle autoresizing

export const ThreadTitle = {
  fontSize: '20px',
  padding: '16px 24px 0 24px',
  outline: 'none',
  border: '0',
  lineHeight: '1.4',
  fontWeight: '800',
  boxShadow: 'none',
  width: '100%',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
  borderRadius: '12px 12px 0 0',
};

export const ThreadDescription = {
  fontSize: '16px',
  fontWeight: '500',
  width: '100%',
  height: 'calc(100% - 132px)',
  display: 'inline-block',
  lineHeight: '1.5',
  padding: '0 24px 24px 24px',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
  overflowY: 'scroll',
  position: 'relative',
  top: '6px',
};
