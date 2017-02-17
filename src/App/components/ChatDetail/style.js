import styled from 'styled-components'
import { Palette, Gradient } from '../../../shared/Globals'

export const ChatContainer = styled.div`
	flex: 1 0 auto;
	padding: 0 8px;
	padding-bottom: 8px;
	display: flex;
	flex-direction: column;
`;

export const Bubble = styled.p`
	display: inline-block;
	flex: 0 0 auto;
	padding: 8px 16px;
	vertical-align: middle;
	border-radius: 16px
	margin-top: 2px;
	font-size: 14px;
	max-width: 60%;
	line-height: 1.4;

	&:first-of-type {
		margin-top: 0;
	}

  a { text-decoration: underline; }
`;

export const BubbleGroup = styled.div`
	width: 100%;
	margin-top: 8px;

	&:first-of-type {
		margin-top: auto;
	}

	> p {

		background-color: ${props => props.me ? Palette.brand.default : Palette.generic.default };
		background-image: ${props => props.me ? Gradient(Palette.brand.alt, Palette.brand.default) : Gradient(Palette.generic.alt, Palette.generic.default) }
		color: ${props => props.me ? Palette.text.reverse : Palette.text.default };
		float: ${props => props.me ? `right;` : `left;`}
		font-weight: ${props => props.me ? `500` : `400`};
		clear: both;

		&:not(:first-of-type) {
			${props => props.me? `border-top-right-radius: 4px` : `border-top-left-radius: 4px` };
		}

		&:not(:last-of-type) {
			${props => props.me? `border-bottom-right-radius: 4px` : `border-bottom-left-radius: 4px` };
		}
	}
`;

export const FromName = styled.span`
	display: inline-block;
	font-size: 10px;
	line-height: 16px;
	font-weight: 500;
	color: ${Palette.text.alt};
	float: ${props => props.me ? `right;` : `left;`}
`;
