import styled from 'styled-components';
import { zIndex } from '../../globals';
import { isMobile } from '../../../helpers/utils';

const maxWidth = '460px';
const mobile = isMobile();
export const modalStyles = {
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
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: zIndex.modal - 1,
    padding: '1.2rem',
  },
  content: {
    position: 'relative',
    background: '#ffffff',
    backgroundClip: 'padding-box',
    borderRadius: '8px',
    border: '0',
    padding: '0',
    zIndex: zIndex.modal,
    width: '100%',
    maxWidth: maxWidth,
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin: 16px 0 8px;
`;

export const Subtitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  text-align: center;
`;

export const Rep = styled.div`
  display: flex;
  background: ${props => props.theme.bg.wash};
  border: 1px solid ${props => props.theme.bg.border};
  padding: 8px;
  border-radius: 4px;
  color: ${props => props.theme.text.alt};
  margin-top: 32px;
`;

export const IconContainer = styled.div`
  color: ${props => props.theme.brand.alt};
`;

export const RepWrapper = styled.span`margin-left: 8px;`;
