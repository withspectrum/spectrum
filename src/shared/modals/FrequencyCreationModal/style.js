import styled from 'styled-components';
import { Tooltip, Gradient } from '../../Globals';

const maxWidth = '360px';
export const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.40)',
    zIndex: 5,
  },
  content: {
    borderRadius: '8px',
    border: '0',
    position: 'absolute',
    bottom: 'auto',
    top: '50%',
    left: '50%',
    padding: '0',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    width: '100%',
    maxWidth: maxWidth,
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

export const Footer = styled.div`
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const NameLabel = styled.label`
  display: block;
  padding: 1rem 1rem 4px;
  width: 100%;
  font-weight: 700;
  font-size: 12px;
  color: ${({ theme }) => theme.text.default};
`

export const NameInput = styled.input`
  display: block;
  width: 100%;
  background: #fff;
  font-weight: 400;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: 2px;
  padding: 8px 12px;
  margin-top: 8px;

  &:focus {
    border: 1px solid ${({ theme }) => theme.brand.default};
  }
`

export const EditSlug = styled.label`
  position: relative;
  display: block;
  width: 100%;
  padding-left: 1rem;
`

export const Pre = styled.span`
  position: absolute;
  top: 2px;
  left: 28px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};
  
  &:before {
    content: '';
    position: absolute;
    top: 6px;
    left: -8px;
    width: 4px;
    height: 4px;
    border-radius: 10px;
    background: ${props => props.error ? props.theme.warn.default : 'transparent'};
  }
`

export const EditSlugInput = styled.input`
  background: #f5f6f7;
  padding: 0 12px 4px 97px;
  margin-left: 12px;
  -webkit-display: none;
  box-shadow: none;
  border-bottom: 1px solid transparent;

  &:focus {
    border-bottom: 1px solid ${({ theme }) => theme.brand.default};
  }
`

export const ErrorMessage = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.brand.default};
  padding-left: 16px;
  margin-bottom: 8px;
  margin-top: 8px;
  position: relative;

  a {
    text-decoration: underline;
  }
`

export const CreateButton = styled.button`
  position: relative;
  top: 2px;
  text-align: center;
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  -webkit-display: none;
  background: ${props => props.disabled ? '#fff' : props.theme.brand.default};
  background-image: ${props => props.disabled ? '#fff' : Gradient(props.theme.brand.alt, props.theme.brand.default)};
  border-radius: 0 0 8px 8px;
  border-top: ${props => props.disabled ? '1px solid #eee' : `1px solid ${props.theme.brand.default}`};
  color: ${props => props.disabled ? props.theme.text.alt : '#fff'};

  &:hover {
    cursor: pointer;
  }
`

export const Privacy = styled.div`
  padding: 1rem 1rem 0;
`

export const PrivacyLabel = styled.label`
  color: ${({ theme }) => theme.text.default};
  font-weight: 700;
  font-size: 12px;
`
export const PrivacyCheckbox = styled.input`
  display: inline-block;
  margin-right: 8px;
`

export const PrivacyText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
  margin-top: 8px;

  b {
    color: ${({ theme }) => theme.text.default};
  }
`