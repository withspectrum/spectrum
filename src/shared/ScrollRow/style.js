import styled from 'styled-components';

export const Hscroll = styled.div`
	overflow-x: scroll;
	width: 100%;
	margin-left: -32px;
	width: calc(100% + 64px);
	display: flex;
	flex-direction: row;
	align-items: stretch;
	padding: 8px 24px 4px;
	background: transparent;
	/* both cursor declarations are needed for x-browser support */
	cursor: pointer;
	cursor: hand;
	cursor: grab;
	min-height: 275px;

	&:active {
		cursor: grabbing;
	}

	@media (max-width: 768px) {
		width: calc(100% + 48px);
	}
`;
