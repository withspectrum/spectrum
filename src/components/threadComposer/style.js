import styled from 'styled-components';
import { Card } from '../card';
import { Transition } from '../globals';

export const Container = styled.div`
  align-self: stretch;
  display: flex;
  justify-content: center;
`;

export const Composer = styled(Card)`
  margin-bottom: 16px;
  position: relative;
  z-index: 11;
  width: 100%;
  display: block;
  min-height: 64px;
  cursor: pointer;
  border-radius: 12px;
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

`;

export const PlaceholderLabel = styled.h3`
  font-size: 20px;
  font-weight: 800;
  margin-left: 8px;
`;

export const ContentContainer = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

export const Actions = styled.div`
  background: #F8FBFE;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 8px;
  border-radius: 0 0 12px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Dropdowns = styled.div`
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
  }

  select + select {
    margin-left: 8px;
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
  display: 'inline-block',
  lineHeight: '1.5',
  padding: '0 24px 24px 24px',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
};
