// @flow
import styled from 'styled-components';

export const PrivacyTermsList = styled.ul`
  padding-top: 24px;
  margin-left: 32px;
  padding-bottom: 24px;

  li {
    font-size: 20px;
    font-weight: 400;
    color: ${props => props.theme.text.secondary};
    line-height: 1.4;
    margin-top: 12px;
  }
`;
