import styled from 'styled-components';
import { Gradient, Shadow, Tooltip } from '../../../../shared/Globals';
import Textarea from 'react-textarea-autosize';

export const Wrapper = styled.span`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-items: center;
	z-index: 200;
	position: relative;
`;

export const Form = styled.form`
	flex: 1 0 auto;
	display: flex;
	align-items: stretch;
`;

export const Input = styled(Textarea)`
	flex: 1 0 auto;
	font-size: 14px;
	line-height: 22px;
	padding: 10px 16px;
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
	padding-top: 4px;
	font-size: 18px;
	border-radius: 0 8px 8px 0;
	background-color: ${({ theme }) => theme.brand.default};
	background-image: ${({ theme }) =>
  Gradient(theme.brand.alt, theme.brand.default)};
  align-self: stretch;
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
	background: ${props =>
  props.active ? props.theme.brand.default : 'transparent'};
	transition: all 0.3s ease-out;

	&:hover {
		cursor: pointer;
		background: ${props =>
  props.active ? props.theme.brand.default : 'transparent'};
		transition: all 0.2s ease-in;
		${props => props.tipText ? Tooltip(props) : ''};

	}

	@media (max-width: 768px) {
		display: none;
	}
`;
