import styled from 'styled-components'
import { Palette, Scale } from '../../../shared/Globals'

export const ScrollBody = styled.div`
	flex: 1 1 auto;
	padding: 0 ${Scale(1)};
	padding-bottom: ${Scale(1)};
	display: flex;
	flex-direction: column;
	overflow-y: auto;
`;

export const Bubble = styled.p`
	display: inline-block;
	flex: 0 0 auto;
	padding: ${Scale(1)} ${Scale(2)};
	vertical-align: middle;
	border-radius: ${Scale(2)}
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
	margin-top: ${Scale(1)};

	&:first-of-type {
		margin-top: auto;
	}

	> p {

		background-color: ${props => props.me ? `#3819E6` : `#D6E0EE;`}
		background-image: ${props => props.me ? `radial-gradient(ellipse farthest-corner at 0px 0px , ${Palette.brand.alt} 0%, ${Palette.brand.default} 100%);` : `radial-gradient(ellipse farthest-corner at 0px 0px , ${Palette.generic.alt} 0%, ${Palette.generic.default} 100%);`}
		color: ${props => props.me ? `#ffffff` : `#171A27;`}
		float: ${props => props.me ? `right;` : `left;`}
		font-weight: ${props => props.me ? `500` : `400`};
		clear: both;

		&:not(:first-of-type) {
			${props => props.me? `border-top-right-radius: ${Scale(.5)}` : `border-top-left-radius: ${Scale(.5)}`};
		}

		&:not(:last-of-type) {
			${props => props.me? `border-bottom-right-radius: ${Scale(.5)}` : `border-bottom-left-radius: ${Scale(.5)}`};
		}
	}
`;

export const FromName = styled.span`
	display: inline-block;
	font-size: 10px;
	line-height: ${Scale(2)};
	font-weight: 500;
	color: #747E8D;
	float: ${props => props.me ? `right;` : `left;`}
`;
