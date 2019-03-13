// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { zIndex } from '../globals';

export const ReputationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: none;
  color: ${theme.text.alt};
  cursor: pointer;
  position: relative;
  z-index: ${zIndex.fullScreen};
  width: fit-content;
`;

export const ReputationLabel = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${theme.text.alt};
`;
