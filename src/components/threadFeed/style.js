// @flow
// $FlowFixMe
import styled from 'styled-components';
import { OutlineButton } from '../buttons';

export const FetchMoreButton = styled(OutlineButton)`
  width: 100%;
  padding: 16px 0;

  @media (max-width: 768px) {
    padding: 32px 0;
    border-radius: 0;
    background: #fff;
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.brand.default};
    border: none;
    box-shadow: none;
    border-top: 2px solid ${props => props.theme.border.default};

    &:hover {
      background: ${props => props.theme.bg.wash};
      border-radius: 0;
      box-shadow: none;
    }
  }
`;

export const Divider = styled.div`
  border-bottom: 2px solid ${props => props.theme.border.default};
  width: 100%;
  display: block;
  padding-top: 24px;
  margin-bottom: 24px;
`;
