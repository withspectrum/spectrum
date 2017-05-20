// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow } from '../../globals';

export const Actions = styled(FlexRow)`
  margin-top: 24px;
  padding: 0 24px 24px;
  justify-content: flex-end;

  button + button {
    margin-left: 8px;
  }
`;

export const Message = styled.div`
  line-height: 1.4;
  margin: 8px 24px;

  p {
    margin-top: 8px;
  }

  b {
    font-weight: 700;
  }
`;
