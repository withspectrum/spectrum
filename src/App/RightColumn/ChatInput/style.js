import styled from 'styled-components';
import { Gradient, IconButton } from '../../../shared/Globals';
import Textarea from 'react-textarea-autosize';

export const Wrapper = styled.span`
	display: flex;
	width: calc(100% - 16px);
	flex: 0 0 auto;
	align-items: center;
	z-index: 200;
	position: relative;
	margin: 0 8px;
	padding: 8px 0;
	border-top: 2px solid ${({ theme }) => theme.border.default};
	background-color: ${({ theme }) => theme.bg.default};
`;

export const Form = styled.form`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	margin-left: 4px;
	padding-left: 4px;
	border: 2px solid ${props => props.theme.brand.default};
	border-radius: 24px;
	background-color: transparent;
`;

export const Input = styled(Textarea)`
	flex: 1 0 auto;
	font-size: 14px;
	font-weight: 500;
	line-height: 24px;
	height: 24px;
	padding: 2px 4px 4px 4px;
	border: none;
	margin-left: 8px;

	@media (max-width: 768px) {
    font-size: 16px;
		margin: 6px 0;
		margin-left: 12px;
		border-radius: 4px;
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
	padding-top: 4px;
	padding-right: 4px;
	font-size: 18px;
	border-radius: 0 24px 24px 0;
	background-color: ${({ theme }) => theme.brand.default};
	background-image: ${({ theme }) =>
  Gradient(theme.brand.alt, theme.brand.default)};
  align-self: stretch;
	position: relative;
	left: 2px;
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
	position: relative;
	top: 2px;

	&:hover {
		cursor: pointer;
	}
`;

export const EmojiToggle = styled(IconButton)`
	@media (max-width: 768px) {
		display: none;
	}
`;
