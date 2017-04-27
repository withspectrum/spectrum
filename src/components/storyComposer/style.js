import styled from 'styled-components';
import { Card } from '../../components/card';

export const Container = styled.div`
  width: calc(100% + 32px);
  display: flex;
  justify-content: center;
`;

export const Composer = styled(Card)`
  margin-bottom: 16px;
  position: relative;
  z-index: ${props => (props.isOpen ? '11' : '10')};
  width: ${props => (props.isOpen ? '100%' : 'calc(100% - 32px)')};
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  color: ${props => props.theme.text.alt};color: ${props => props.theme.text.alt};
  position: ${props => (props.isOpen ? 'absolute' : 'relative')};
  opacity: ${props => (props.isOpen ? '0' : '1')};

  &:hover {
    color: ${props => props.theme.text.default};
  }

  /* manually position the edit icon */
  div {
    position: relative;
    top: -2px;
  }
`;

export const PlaceholderLabel = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
`;

export const ContentContainer = styled.div`
  position: ${props => (props.isOpen ? 'relative' : 'absolute')};
  opacity: ${props => (props.isOpen ? '1' : '0')};
`;

export const Actions = styled.div`
  background: #F8FBFE;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 8px;
  border-radius: 0 0 12px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

// these are style objects because i'm custom styling another react component to handle autoresizign

export const StoryTitle = {
  fontSize: '20px',
  padding: '32px 32px 0 32px',
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

export const StoryDescription = {
  marginTop: '8px',
  fontSize: '14px',
  width: '100%',
  display: 'inline-block',
  lineHeight: '1.5',
  padding: '0 32px 32px 32px',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#171A21',
  whiteSpace: 'pre-wrap',
};
