import styled from 'styled-components';
import { Gradient, Shadow } from '../Globals';

export const Button = styled.button`
  background-color: ${props =>
  props.disabled ? props.theme.inactive : 'transparent'};
  border: 2px solid ${props =>
  props.disabled ? 'transparent' : props.theme.brand.alt};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${props =>
  props.disabled ? props.theme.text.reverse : props.theme.brand.alt};
  transition: all 0.2s ease-out;
  padding: 8px 16px;
  
  ${props => !props.disabled
  ? `&:hover {
        border-radius: 16px;
        background-color: ${({ theme }) => theme.brand.default};
        background-image: ${({ theme }) =>
      Gradient(theme.brand.alt, theme.brand.default)};
        color: ${({ theme }) => theme.text.reverse};
        transition: all 0.2s ease-in;
        cursor: pointer;
      }`
  : ''}`;

export const TextButton = styled(Button)`
  background-color: transparent;
  border: none;
  border-radius: 0px;
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
  props.inactive ? props.theme.inactive : props.theme.warn.alt};
  transition: all 0.2s ease-out;
  padding: 8px 16px;

  ${props => !props.disabled
  ? `&:hover {
        border-radius: 8px;
        background-color: ${({ theme }) => theme.bg.default};
        background-image: none;
        box-shadow: ${Shadow.button};
        transition: all 0.2s ease-in;
        cursor: pointer;
      }`
  : ''}`;

export default {
  Button,
  TextButton,
};
