// @flow
// $FlowFixMe
import styled from 'styled-components';
import { isMobile } from '../../helpers/utils';
import { IconButton } from '../buttons';

/*
  This is the global stylesheet for all modal components. Its styles will wrap
  all modal content, so we should be selective about what is included here
*/

const mobile = isMobile();
/*
  modalStyles are defined as a JS object because it gets passed in as inline
  styles to the react-modal component. Takes an optional maxWidth argument for
  desktop sizing.
*/
export const modalStyles = (maxWidth: number = 360) => {
  return {
    // dark background behind all modals
    overlay: {
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: mobile ? 'flex-start' : 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'visible',
      overflowX: 'hidden',
      zIndex: 200,
      padding: '1.2rem',
      borderRadius: '1rem',
    },
    // modal root
    content: {
      position: 'relative',
      background: '#ffffff',
      backgroundClip: 'padding-box',
      borderRadius: '12px',
      border: '0',
      padding: '0',
      zIndex: 201,
      width: '100%',
      maxWidth: `${maxWidth}px`,
      top: 'auto',
      bottom: 'auto',
      left: 'auto',
      right: 'auto',
      backgroundColor: 'rgba(0,0,0,0)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
  };
};

export const ModalBody = styled.div`
  /* modal content should always flow top-to-bottom. inner components can
  have a flex-row property defined */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: ${({ theme }) => theme.bg.default};
  overflow: visible;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 28px;
`;

export const Header = styled.div`
  padding: 20px 24px 0;
`;

export const ModalContent = styled.div``;

export const Footer = styled.div``;

export const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 2;
  color: ${({ theme }) => theme.text.placeholder};

  &:hover {
    color: ${({ theme }) => theme.warn.alt};
  }
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.text.default};
  padding: 8px 0 16px;
  line-height: 1.4;
`;

export const Notice = styled(Description)`
  padding: 8px 16px;
  margin: 8px 0;
  border-radius: 4px;
  background: #FFF1CC;
  border: 1px solid #ffd566;
  color: #715818;
`;
