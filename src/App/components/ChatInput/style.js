import styled from 'styled-components'
import { Palette, Gradient, Shadow } from '../../../shared/Globals'

export const Form = styled.form`
	flex: 1 0 auto;
	width: 100%;
	display: flex;
	align-items: stretch;
`;

export const Input = styled.input`
	flex: 1 0 auto;
	font-size: 14px;
	line-height: 32px;
	padding: 4px 16px;
	border: 1px solid ${Palette.border.default};
	border-right: none;
	border-radius: 8px 0 0 8px;
	box-shadow: ${Shadow.input};

	&::placeholder { color: ${Palette.text.placeholder} }
  &::-webkit-input-placeholder { color: ${Palette.text.placeholder} }
  &:-moz-placeholder { color: ${Palette.text.placeholder} }
  &:-ms-input-placeholder { color: ${Palette.text.placeholder} }
`;

export const Button = styled.button`
	flex: 0 0 72px;
	height: 100%;
	color: ${Palette.text.reverse};
	font-weight: bold;
	padding-top: 2px;
	font-size: 18px;
	border-radius: 0 8px 8px 0;
	background-color: ${Palette.brand.default};
	background-image: ${Gradient(Palette.brand.alt, Palette.brand.default)};
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	padding: 8px;
	background-color: ${Palette.bg.wash};
	border-top: 1px solid ${Palette.border.default};
`;