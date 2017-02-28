import styled from 'styled-components';
import { Gradient, Shadow } from '../../../shared/Globals';

export const Form = styled.form`
	flex: 1 0 auto;	
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

	@media (max-width: 768px) {
    font-size: 16px;
  }

	&::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) =>
  theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }
`;

export const Button = styled.button`
	flex: 0 0 48px;
	color: ${({ theme }) => theme.text.reverse};
	font-weight: bold;
	padding-top: 2px;
	font-size: 18px;
	border-radius: 0 8px 8px 0;
	background-color: ${({ theme }) => theme.brand.default};
	background-image: ${({ theme }) =>
  Gradient(theme.brand.alt, theme.brand.default)};
  align-self: stretch;
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	align-items: center;
	padding: 8px;
	background-color: ${({ theme }) => theme.bg.wash};
	border-top: 1px solid ${({ theme }) => theme.border.default};

	@media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

export const MediaInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;

export const MediaLabel = styled.label`
	border: none;
	outline: 0;
	display: inline-block;
	background: transparent;
	transition: all 0.3s ease-out;
	border-radius: 4px;
	padding: 4px;

	&:hover {
		cursor: pointer;
		background-color: #eee;
		transition: all 0.2s ease-in;
	}
`;

export const EmojiToggle = styled.div`
	display: inline-block;
	font-size: 24px;
	line-height: 40px;
	vertical-align: middle;
	text-align: center;
	border-radius: 4px;
	-webkit-flex: 0 0 auto;
	height: 40px;
	width: 40px;
	margin: 0 8px 0 4px;
	background: ${props => props.active ? props.theme.brand.default : '#f6f7f8'};
	transition: all 0.3s ease-out;

	&:hover {
		cursor: pointer;
		transform: scale(1.1);
		background: ${props => props.active ? props.theme.brand.default : '#eee'};
		transition: all 0.2s ease-in;
	}

	@media (max-width: 768px) {
		display: none;
	}
`;
