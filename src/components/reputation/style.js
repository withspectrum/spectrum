// @flow
import styled from 'styled-components';
import { Tooltip } from '../globals';

export const ReputationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: none;
  color: inherit;
  ${Tooltip};
`;

export const ReputationLabel = styled.span`
  font-weight: ${props => (props.size === 'large' ? '600' : '400')};
`;
