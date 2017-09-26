// @flow
// $flowignore
import styled from 'styled-components';

export const Heading = styled.h1`
  margin-left: 16px;
  font-size: 24px;
  color: ${props => props.theme.text.default};
  font-weight: 800;
`;

export const Subheading = styled.h3`
  margin-left: 16px;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  font-weight: 600;
`;

export const StyledHeader = styled.div`
  display: flex;
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  width: 100%;
  align-items: center;
`;
