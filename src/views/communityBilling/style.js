// @flow
import styled from 'styled-components';

export const EmailForm = styled.form`
  display: flex;
  align-items: flex-end;

  button {
    align-self: flex-end;
    margin-left: 16px;
  }
`;

export const SourceContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const SourceText = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 12px;
`;
export const SourceName = styled.p`
  line-height: 1.3;
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
`;
export const SourceExpiration = styled.p`
  line-height: 1.3;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
`;
