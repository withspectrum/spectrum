import styled from 'styled-components';
import { P } from '../../Globals';
import { isMobile } from '../../../helpers/utils';
import Icon from '../../../shared/Icons';

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
    zIndex: 200,
    padding: '1.2rem',
  },
  content: {
    position: 'relative',
    background: '#ffffff',
    backgroundClip: 'padding-box',
    borderRadius: '8px',
    border: '0',
    padding: '0',
    zIndex: 201,
    width: '360px',
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

// For some reason we need this so the checkbox is aligned with the text
export const CheckboxWrapper = styled.span`
  > div {
    vertical-align: middle;
    margin-left: -6px;
  }

  > a {
    text-decoration: none;
    color: ${({ theme }) => theme.brand.alt};
    font-weight: 600;
    border-bottom: 2px solid transparent;
    position: relative;
    padding-bottom: 0px;
    transition: all 0.3s ease-out;

    &:hover {
      border-bottom: 2px solid ${({ theme }) => theme.brand.alt};
      padding-bottom: 2px;
      transition: all 0.2s ease-in;
    }
  }
`;

export const HiddenInput = styled.input`
  visibility: hidden;
  width: 0;
  height: 0;
`;
