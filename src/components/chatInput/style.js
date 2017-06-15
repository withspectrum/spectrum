import styled from 'styled-components';
import { IconButton } from '../buttons';
import { FlexRow, Transition } from '../globals';
import Editor from '../../components/editor';

export const ChatInputWrapper = styled(FlexRow)`
  flex: none;
  align-items: center;
  z-index: 200;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 8px;
  border-top: 2px solid ${({ theme }) => theme.border.default};

  @media (max-width: 768px) {
    bottom: ${props => (props.focus ? '0' : 'auto')};
    position: ${props => (props.focus ? 'fixed' : 'relative')};
    background-color: ${props => (props.focus ? props.theme.bg.default : 'transparent')};
    z-index: 1001;
  }
`;

export const Form = styled.form`
	flex: auto;
	display: flex;
  min-width: 1px;
  max-width: 100%;
	align-items: center;
	margin-left: 4px;
	border-radius: 24px;
	background-color: transparent;
  position: relative;
`;

export const EditorInput = styled(Editor)`
	flex: auto;
	font-size: 14px;
	font-weight: 500;
	line-height: 20px;
	max-height: 120px;
	min-height: 40px;
  max-width: 100%;
	padding: 8px 40px 8px 16px;
	border-radius: 24px;
	border: 2px solid ${props => props.theme.text.placeholder};
  border-color: ${props => (props.focus ? props.theme.brand.default : props.theme.text.placeholder)};
	transition: border 0.3s ease-out;
	color: ${props => props.theme.text.default};
  overflow-y: scroll;

	@media (max-width: 768px) {
    font-size: 16px;
		padding-left: 16px;
    ${/* width: calc(100% - 72px); */ ''}
  }

	&::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }

	&:hover {
		border-color: ${props => props.theme.text.alt};
		transition: border-color 0.2s ease-in;
	}
`;

export const SendButton = styled(IconButton)`
	position: absolute;
	right: 12px;
  height: 32px;
  width: 32px;
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
  color: ${({ theme }) => theme.text.alt};

	&:hover {
		cursor: pointer;
    color: ${({ theme }) => theme.brand.default};
	}
`;

export const EmojiToggle = styled(IconButton)`
	position: absolute;
	left: 56px;
	background-color: transparent;
	top: calc(50% - 16px);

	@media (max-width: 768px) {
		display: none;
	}
`;
