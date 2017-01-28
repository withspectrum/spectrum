import styled from 'styled-components';

export const Bubble = styled.div`
	padding: 16px;
	border-radius: 16px;
	margin-top: 4px;

	&:first-of-type {
		margin-top: 0;
	}
`;

export const LeftBubble = styled(Bubble)`
	background-color: gray;
	color: black;

	&:not(:first-of-type) {
		border-top-left-radius: 4px;
	}

	&:not(:last-of-type) {
		border-bottom-left-radius: 4px;
	}
`;

export const OpBubble = styled(LeftBubble)`
	background-color: black;
	color: white;
`;

export const RightBubble = styled(Bubble)`
	background-color: purple;
	color: white;
	&:not(:first-of-type) {
		border-top-right-radius: 4px;
	}

	&:not(:last-of-type) {
		border-bottom-right-radius: 4px;
	}
`;

export const BubbleGroup = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 16px;

	&:before {
		content: 'Commenter Name';
		display: inline-block;
		font-size: 12px;
		color: gray;
	}
`;