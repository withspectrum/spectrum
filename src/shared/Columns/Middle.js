import styled from 'styled-components';
import ScrollBody from '../ScrollBody';

export default styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.wash};
  border-right: 1px solid ${({ theme }) => theme.border.default};
  flex: 0 0 480px;
  z-index: 1;
  overflow-y: hidden;

  @media (max-width: 768px) {
    border-right: 0;
    transform: translateX( -100% );
    pointer-events: ${props =>
  props.active || props.viewing === 'detail' ? 'none' : 'auto'};
  }
`;
