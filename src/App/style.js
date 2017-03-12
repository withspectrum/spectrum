import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;

export const ScrollBody = styled.div`
	height: 100%;
	overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  position: relative;

  @media (max-width: 768px) {
    flex: 1 0 auto;
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;
    transition: all 0.2s ease-in-out;
  }
`;

export const NavMasterContainer = styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.reverse};
  flex: 0 0 256px;
  z-index: 10;

  @media (max-width: 768px) {
    transition: all 0.2s ease-in-out;
    transform: translateX( ${props =>
  props.viewing === 'frequencies' ? '0' : '-100%'} )
  }
`;

export const StoryMasterContainer = styled(ScrollBody)`
  background: ${({ theme }) => theme.bg.wash};
  border-right: 1px solid ${({ theme }) => theme.border.default};
  flex: 0 0 512px;
  z-index: 9;

  @media (max-width: 768px) {
    border-right: 0;
    transition: all 0.2s ease-in-out;
    transform: translateX( -100% )
  }
`;

export const DetailViewContainer = styled(ScrollBody)`
  background${({ theme }) => theme.bg.default};
  flex: 1 1 auto;
  z-index: 10;

  @media (max-width: 768px) {
    transition: all 0.2s ease-in-out;
    transform: translateX( ${props =>
  props.active || props.viewing === 'detail' ? '-200%' : '-100%'} )
  }
`;
