import styled from 'styled-components';

export const Bubble = styled.div`
	padding: 8px 12px;
	border-radius: 1.25rem;
	margin-top: 4px;
	font-size: 14px;

	&:first-of-type {
		margin-top: 0;
	}
`;

export const LeftBubble = styled(Bubble)`
	background-color: #D6E0EE;
	background-image: radial-gradient(ellipse farthest-corner at 0px 0px , #D6E0EE 0%, #CBD9ED 100%);
	color: #171A27;

	&:not(:first-of-type) {
		border-top-left-radius: 4px;
	}

	&:not(:last-of-type) {
		border-bottom-left-radius: 4px;
	}
`;

export const OpBubble = styled(LeftBubble)`
	background-color: #0F1628;
	background-image: radial-gradient(ellipse farthest-corner at 0px 0px , #0F1628 0%, #3A3D51 100%);
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
	width: 100%;
	margin-top: 16px;
`;

export const FromName = styled.span`
	display: inline-block;
	font-size: 12px;
	color: #747E8D;
`;