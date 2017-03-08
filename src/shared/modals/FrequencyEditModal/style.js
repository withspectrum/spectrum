import styled from 'styled-components';
import { Gradient, P } from '../../Globals';
import { isMobile } from '../../../helpers/utils';

const maxWidth = '360px';
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
    zIndex: 1000,
    padding: '1.2rem',
  },
  content: {
    position: 'relative',
    background: '#ffffff',
    backgroundClip: 'padding-box',
    borderRadius: '8px',
    border: '0',
    padding: '0',
    zIndex: 1001,
    width: '100%',
    maxWidth: maxWidth,
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

export const Footer = styled.div`
  padding: 0;
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  > button:last-of-type {
    margin-left: 16px;
  }
`;

export const ErrorMessage = styled(P)`
  font-size: 14px;
  color: ${({ theme }) => theme.warn.alt};
  font-weight: 500;
  margin-bottom: 8px;
  margin-top: 16px;

  a {
    font-weight: 700;
    border-bottom: 2px solid ${({ theme }) => theme.warn.alt};
  }
`;

export const BigDeleteButton = styled.button`
  position: relative;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 700;
  -webkit-display: none;
  display: inline-block;
  background: ${props => props.theme.warn.default};
  border-radius: 4px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

export const DeleteWarning = styled.div`
  width: 100%;
  padding: 12px 16px;
  margin-top: 24px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 4px;
  color: ${props => props.theme.text.reverse};
  background: ${props => props.theme.warn.default};
`;
