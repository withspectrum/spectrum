// @flow
import styled from 'styled-components';

export const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontSmoothing: 'antialiased',
    fontSize: '18px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;
`;

export const Well = styled.div`
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  border: 1px solid ${props => props.theme.bg.border};
  margin-top: 4px;
  flex-direction: ${props => (props.column ? 'column' : 'row')};

  p {
    margin-bottom: 8px;
  }

  form {
    width: 100%;
  }

  img {
    margin-right: 8px;
  }
`;
