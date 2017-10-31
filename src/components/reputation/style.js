// @flow
import styled from 'styled-components';
import { Tooltip, zIndex } from '../globals';

export const ReputationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: none;
  color: inherit;
  cursor: pointer;
  position: relative;
  z-index: ${zIndex.fullScreen};
  ${Tooltip};
`;

export const ReputationLabel = styled.span`
  font-size: 14px;
  font-weight: ${props => (props.size === 'large' ? '600' : '400')};
`;
