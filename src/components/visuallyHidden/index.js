// @flow
import styled from 'styled-components';

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
`;

export default VisuallyHidden;
