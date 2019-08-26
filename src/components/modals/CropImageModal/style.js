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
