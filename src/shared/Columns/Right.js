import styled from 'styled-components';
import ScrollBody from '../ScrollBody';

export default styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.default};
  flex: 1 1 auto;
  z-index: 2;

  @media (max-width: 768px) {
    transform: translateX( ${props =>
  props.active || props.viewing === 'detail' ? '-200%' : '-100%'} )
    overflow-y: hidden;
  }
`;
