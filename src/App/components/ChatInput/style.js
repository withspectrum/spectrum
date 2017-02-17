import styled from 'styled-components';
import { Gradient, Shadow } from '../../../shared/Globals';

export const Form = styled.form`
	flex: 0 0 auto;
	width: 100%;
	display: flex;
	align-items: stretch;
`;

export const Input = styled.input`
	flex: 1 0 auto;
	font-size: 14px;
	line-height: 32px;
	padding: 4px 16px;
	border: 1px solid ${({ theme }) => theme.border.default};
	border-right: none;
	border-radius: 8px 0 0 8px;
	box-shadow: ${Shadow.input};

	&::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) =>
  theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }
`;

export const Button = styled.button`
	flex: 0 0 72px;
	height: 100%;
	color: ${({ theme }) => theme.text.reverse};
	font-weight: bold;
	padding-top: 2px;
	font-size: 18px;
	border-radius: 0 8px 8px 0;
	background-color: ${({ theme }) => theme.brand.default};
	background-image: ${({ theme }) =>
  Gradient(theme.brand.alt, theme.brand.default)};
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	padding: 8px;
	background-color: ${({ theme }) => theme.bg.wash};
	border-top: 1px solid ${({ theme }) => theme.border.default};
`;
