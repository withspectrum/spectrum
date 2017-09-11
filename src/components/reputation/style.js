// @flow
import styled from 'styled-components';

export const ReputationIcon = styled.div`
  display: inline-block;
  position: relative;
  top: 1px;
  vertical-align: middle;
  flex: none;
  color: ${props => props.theme.brand.alt};
  margin-right: 4px;
`;

export const ReputationIconMini = styled(ReputationIcon)``;
