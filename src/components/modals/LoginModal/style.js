// @flow
// $FlowFixMe
import styled from 'styled-components';

export const SignInButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px;

  button {
    align-self: stretch;
    justify-content: center;
  }

  button + button {
    margin-top: 16px;
  }
`;

export const Description = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  padding: 8px 24px 16px;
  line-height: 1.4;
`;
