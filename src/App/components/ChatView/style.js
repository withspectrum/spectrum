import styled from 'styled-components';

export const ScrollBody = styled.div`
	flex: 1 1 auto;
	padding: 0 8px;
	padding-bottom: 8px;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
`;

export const Bubble = styled.p`
	display: inline-block;
	flex: 0 0 auto;
	padding: 8px 14px;
	vertical-align: middle;
	border-radius: 1.25rem;
	margin-top: 2px;
	font-size: 14px;
	max-width: 60%;
	line-height: 1.4;

	&:first-of-type {
		margin-top: 0;
	}
  a { text-decoration: underline; }
`;

// export const OpBubble = styled(LeftBubble)`
// 	background-color: #0F1628;
// 	background-image: radial-gradient(ellipse farthest-corner at 0px 0px , #0F1628 0%, #3A3D51 100%);
// 	color: white;
// `;

export const BubbleGroup = styled.div`
	width: 100%;
	margin-top: 8px;

	&:first-of-type {
		margin-top: auto;
	}

	> p {

		background-color: ${props => props.me ? `#3819E6` : `#D6E0EE;`}
		background-image: ${props => props.me ? `radial-gradient(ellipse farthest-corner at 0px 0px , #7B16FF 0%, #3819E6 100%);` : `radial-gradient(ellipse farthest-corner at 0px 0px , #D6E0EE 0%, #CBD9ED 100%);`}
		color: ${props => props.me ? `#ffffff` : `#171A27;`}
		float: ${props => props.me ? `right;` : `left;`}
		font-weight: ${props => props.me ? `500` : `400`};
		clear: both;

		&:not(:first-of-type) {
			${props => props.me? `border-top-right-radius: 6px;` : `border-top-left-radius: 6px;`}
		}

		&:not(:last-of-type) {
			${props => props.me? `border-bottom-right-radius: 6px;` : `border-bottom-left-radius: 6px;`}
		}
	}
`;

export const FromName = styled.span`
	display: inline-block;
	font-size: 10px;
	font-weight: 500;
	color: #747E8D;
	float: ${props => props.me ? `right;` : `left;`}
`;
