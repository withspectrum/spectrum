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
	color: ${props => props.theme.brand.default};
	font-weight: 800;
	font-size: 0.75rem;
	display: inline-block;
	margin: 0.5rem 0 1rem;
	background: transparent;

	&:hover {
		cursor: pointer;
	}
`;

export const EmojiToggle = styled.div`
	font-size: 20px;
	margin: 1px 8px;
	line-height: 1;
	border-radius: 4px;
	-webkit-flex: 0 0 auto;
	height: 40px;
	padding: 12px;
	padding-top: 11px;
	padding-bottom: 4px;
	background: ${props => props.active ? props.theme.brand.default : '#f6f7f8'};

	&:hover {
		cursor: pointer;
		background: ${props => props.active ? props.theme.brand.default : '#eee'};
	}

	@media (max-width: 768px) {
		display: none;
	}
`;
