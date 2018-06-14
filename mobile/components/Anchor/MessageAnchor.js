// @flow
import Anchor from './ThreadAnchor';
import styled from 'styled-components';

export const MessageAnchor = styled(Anchor)`
  color: ${props => props.theme.text.default};
  font-weight: 700;
`;
