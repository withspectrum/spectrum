// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow } from '../../globals';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: 1 0 auto;
  padding: 0 24px 24px;
`;

export const Actions = styled(FlexRow)`
  margin-top: 24px;
  justify-content: flex-end;

  button + button {
    margin-left: 8px;
  }
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
