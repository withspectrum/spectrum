// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
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

export const Subtitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.text.alt};
  margin-left: 24px;
  margin-top: 16px;
  margin-right: 24px;
`;
