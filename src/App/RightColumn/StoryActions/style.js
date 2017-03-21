import styled from 'styled-components';
import { Tooltip } from '../../../shared/Globals';

export const StoryActionsContainer = styled.div`
	display: flex;
	flex: 0 0 auto;
	justify-content: space-between;
	padding: 16px 32px;
	padding-top: 0;
	border-bottom: 1px solid ${({ theme }) => theme.border.default};

	@media (max-width: 768px) {
		padding: 16px;
	}
`;

export const HiddenInput = styled.input`
	display: none;
`;

export const HiddenLabel = styled.span`
	display: inline-block;
	width: 32px;
	height: 32px;
	${props => props.tipText ? Tooltip(props) : ''};
`;

export const HiddenButton = styled.button`
	background-color: transparent;
	position: relative;
`;

export const DeleteConfirm = styled.span`
	position: absolute;
	background: ${props => props.theme.warn.default};
	padding: 8px;
	border-radius: 4px;
	width: 115px;
	color: #fff;
	font-size: 13px;
	font-weight: 700;
	pointer-events: ${props => props.visible ? 'auto' : 'none'};
	opacity: ${props => props.visible ? '1' : '0'};
	right: ${props => props.visible ? '38px' : '28px'};
	transition: all 0.2s;

	&:hover {
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		transition: all 0.2s;
	}
`;
