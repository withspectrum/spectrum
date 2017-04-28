import styled from 'styled-components';
import { IconButton, Transition } from '../../../../shared/Globals';
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
	border-radius: 24px;
	background-color: transparent;
`;

export const Input = styled(Textarea)`
	flex: 1 0 auto;
	font-size: 14px;
	font-weight: 500;
	line-height: 20px;
	max-height: 120px;
	min-height: 40px;
	padding: 8px 40px;
	border-radius: 24px;
	border: 2px solid ${props => props.theme.text.placeholder};
	transition: border 0.3s ease-out;
	color: ${props => props.theme.text.default};

	@media (max-width: 768px) {
    font-size: 16px;
		padding-left: 16px;
  }

	&::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }

	&:focus {
		border-color: ${props => props.theme.brand.default};
		transition: border-color 0.2s ease-in;

		&:hover {
			border-color: ${props => props.theme.brand.default};
		}
	}

	&:hover {
		border-color: ${props => props.theme.text.alt};
		transition: border-color 0.2s ease-in;
	}
`;

export const SendButton = styled(IconButton)`
	position: absolute;
	right: 8px;
	background-color: transparent;
	transition: ${Transition.hover.off};
	top: calc(50% - 16px);

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
	position: absolute;
	left: 48px;
	background-color: transparent;
	top: calc(50% - 16px);

	@media (max-width: 768px) {
		display: none;
	}
`;
