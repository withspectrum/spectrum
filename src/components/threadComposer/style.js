import styled from 'styled-components';
import { Card } from '../card';
import { Transition, hexa, Shadow, FlexRow } from '../globals';

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
    z-index: 11;
  }
`;

export const Composer = styled(Card)`
  margin-bottom: 16px;
  position: relative;
  z-index: 11;
  width: 100%;
  display: block;
  min-height: 64px;
  border-radius: 12px;
  transition: ${Transition.hover.off};

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.placeholder, 0.5)};
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
  ${props => (props.isOpen ? `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      background: #000;
      pointer-events: auto;
      opacity: 0.4;
    ` : `
      opacity: 0;
      pointer-events: none;

    `)}
`;

export const Placeholder = styled.div`
  ${/* either the placeholder *or* the content container shows at a time. */ ''}
  display: ${props => (props.isOpen ? 'none' : 'flex')};
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  color: ${props => props.theme.text.alt};
  transition: ${Transition.hover.off};

  &:hover {
    transition: ${Transition.hover.on};
    color: ${props => props.theme.brand.alt};
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

export const Actions = styled(FlexRow)`
  background: #F8FBFE;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 8px 8px 8px 0;
  border-radius: 0 0 12px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

  select {
    max-width: 224px;
    display: block;
    padding: 8px 12px;
    border: none;
    border: 2px solid ${props => props.theme.border.default};
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
  }

  > div {
    color: ${props => props.theme.text.placeholder};
    margin-left: 4px;

    &:nth-of-type(2) {
      margin-left: 8px;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 8px;

    div {
      display: none;
    }

    select:nth-of-type(2) {
        flex: 1 0 auto;
        margin-left: 4px;
      }
    }
  }
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
