import styled from 'styled-components';

export const Body = styled.div`
  background: #f6f7f8;
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  height: 100vh;
	overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

export const ScrollBody = styled.div`
  display: flex;
  position: relative;
  height: 100vh;
  max-height: 100vh;
  overflow-y: scroll;

  @media (max-width: 768px) {
    flex: 1 0 auto;
    width: 100%;
  }
`;

export const NavMasterContainer = styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.reverse};
  flex: 0 0 256px;
  z-index: 2;

  @media (max-width: 768px) {
    transform: translateX( ${props =>
  props.viewing === 'frequencies' ? '0' : '-100%'} )
  }
`;

export const StoryMasterContainer = styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.wash};
  border-right: 1px solid ${({ theme }) => theme.border.default};
  flex: 0 0 512px;
  z-index: 1;

  @media (max-width: 768px) {
    border-right: 0;
    transform: translateX( -100% );
  }
`;

export const DetailViewContainer = styled(ScrollBody)`
  background${({ theme }) => theme.bg.default};
  flex: 1 1 auto;
  z-index: 2;

  @media (max-width: 768px) {
    transform: translateX( ${props =>
  props.active || props.viewing === 'detail' ? '-200%' : '-100%'} )
  }
`;
