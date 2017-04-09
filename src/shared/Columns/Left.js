import styled from 'styled-components';
import ScrollBody from '../ScrollBody';

export default styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.reverse};
  flex: 0 0 256px;
  z-index: 2;

  @media (max-width: 768px) {
    transform: translateX( ${props =>
  props.viewing === 'frequencies' ? '0' : '-100%'} )
  }
`;
