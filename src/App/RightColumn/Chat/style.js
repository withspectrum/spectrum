import styled from 'styled-components';
import { Gradient, Tooltip, Transition } from '../../../shared/Globals';

export const ChatContainer = styled.div`
	flex: 1 0 auto;
	padding: 0 8px;
	padding-bottom: 8px;
	display: flex;
	flex-direction: column;

	@media (max-width: 768px) {
    padding-bottom: 32px;
  }
`;

export const BubbleWrapper = styled.span`
	display: flex;
	flex: 0 0 auto;
	margin-top: 2px;
	max-width: 60%;
	align-self: ${props => props.me ? `flex-end;` : `flex-start;`}
	position: relative;

	/* reactions */
	b {

	}
`;

export const Reaction = styled.b`
	position: absolute;
	bottom: 0;
	${props => props.me ? 'right: calc(100% - 8px)' : 'left: calc(100% - 8px)'};
	max-width: ${props => props.hasCount ? '100%' : '12px'};
	max-height: ${props => props.hasCount ? '24px' : '12px'};
	border: 2px solid #fff;
	border-radius: ${props => props.hasCount ? '24px' : '8px'};

	${props => props.hasCount
  ? `background-color: ${props.active
      ? props.theme.warn.default
      : props.theme.text.alt};
		background-image: ${props.active
      ? Gradient(props.theme.warn.alt, props.theme.warn.default)
      : 'none'}
			`
  : `background-color: ${props.theme.border.default};
		background-image: none;`}

	padding: ${props => props.hasCount ? '0 10px 0 6px' : '0'};
	display: flex;
	flex-direction: flex-row;
	transition: ${Transition.hover.off};
	display: ${props => props.hide ? 'none' : 'auto'};

	i { /* count */
		position: relative;
		transform: ${props => props.hasCount ? 'translateX(0)' : 'translateX(-16px)'};
		opacity: ${props => props.hasCount ? '1' : '0'};
		padding-left: 4px;
		line-height: 1.74;
		vertical-align: middle;
		font-style: normal;
		font-weight: 600;
	}

	div {
		position: relative;
		top: 1px;
		pointer-events: none;
	}

	svg, i {
		transform: ${props => props.hasCount ? 'scale(1)' : 'scale(0)'};
		transition: ${Transition.hover.off};
	}

	&:hover {
		max-width: 100px;
		max-height: 24px;
		border-radius: 24px;
		padding: 0 10px 0 6px;
		background: ${props =>
  props.active ? props.theme.warn.default : props.theme.text.alt};
		background-image: ${props =>
  props.active
    ? Gradient(props.theme.warn.alt, props.theme.warn.default)
    : Gradient(props.theme.text.alt, props.theme.text.alt)}
		cursor: pointer;
		transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
		box-shadow: ${props => props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};

		i {
			transform: translateX(0);
			opacity: 1;
		}

		svg, i {
			transform: scale(1);
			transition: ${Transition.hover.on};
		}
	}

	&:active {
		transform: scale(0.9);
		transition: ${Transition.hover.off};
	}
`;

export const Count = styled.i`
	font-weight: 600;
	color: #fff;
	font-size: 12px;
	display: inline-block;
`;

export const Bubble = styled.p`

	padding: 8px 16px;
	vertical-align: middle;
	border-radius: 16px;

	font-size: 14px;

	line-height: 20px;
	opacity: ${props => props.persisted === false ? 0.5 : 1};
	transition: opacity 0.2s ease-out;

	&:first-of-type:first-child { /* first message bubble, but could be preceded by an emoji */
		margin-top: 0;
	}

  a {
  	text-decoration: underline;
  	word-wrap: break-word;
  	line-height: inherit;
  	word-break: break-all;
		display: inline-block;
  }

	& + div { /* if bubble is followed by an emoji, don't let the emoji have bottom margin */
		margin-bottom: 0;
	}
`;

export const Messages = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

export const Avatar = styled.img`
	width: 32px;
	height: 32px;
	border-radius: 100%;
	align-self: flex-end;
	-webkit-user-select: none; /* Chrome/Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+ */

	/* Rules below not implemented in browsers yet */
	-o-user-select: none;
	user-select: none;
`;

export const HiddenLabel = styled.span`
	display: inline-block;
	width: 32px;
	margin-right: 8px;
	display: flex;
	align-self: flex-end;
	${props => props.tipText ? Tooltip(props) : ''};
`;

export const Timestamp = styled.div`
	width: 100%;
	margin: 32px 0 16px;
	display: block;
	text-align: center;
	font-size: 12px;
	color: ${({ theme }) => theme.text.alt};
	background: #fff;
	position: relative;
	z-index: 0;
	-webkit-user-select: none; /* Chrome/Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+ */

	/* Rules below not implemented in browsers yet */
	-o-user-select: none;
	user-select: none;

	span {
		margin: 0 auto;
		display: inline-block;
		padding: 4px 32px;
		background: #fff;
		position: relative;
		z-index: 5;
	}

	&:after {
		position: absolute;
		width: 100%;
		top: 16px;
		left: 0;
		right: 0;
		z-index: 4;
		content: '';
		border-bottom: 1px solid #f6f7f8;
	}
`;

export const BubbleGroup = styled.div`
	width: 100%;
	margin-top: 16px;
	display: flex;
	justify-content: ${props => props.me ? `flex-end;` : `flex-start;`}

	&:first-of-type {
		margin-top: auto;
	}

	p {
		background-color: ${props =>
  props.me ? props.theme.brand.default : props.theme.generic.default};
		background-image: ${props =>
  props.me
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : Gradient(props.theme.generic.alt, props.theme.generic.default)}
		color: ${props =>
  props.me ? props.theme.text.reverse : props.theme.text.default};
		align-self: ${props => props.me ? `flex-end;` : `flex-start;`}
		font-weight: ${props => props.me ? `500` : `400`};
		clear: both;

		&::selection {
		  background-color: ${props =>
  props.me ? props.theme.text.default : props.theme.brand.alt};
}
	}
`;

export const ImgBubble = styled.img`
	display: block;
	clear: both;
	flex: 0 0 auto;
	vertical-align: middle;
	border-radius: 16px
	margin-top: 2px;
	max-width: 100%;
	display: flex;
	align-self: ${props => props.me ? `flex-end;` : `flex-start;`};
	opacity: ${props => props.persisted === false ? 0.5 : 1};
	border: 1px solid #f6f7f8;

	&:first-of-type {
		margin-top: 0;
	}
`;

export const EmojiBubble = styled.div`
	font-size: 40px;
  padding: 8px;
  clear: both;
  display: block;
  margin-top: 12px;
  margin-bottom: 12px;
	display: flex;
	align-self: ${props => props.me ? `flex-end;` : `flex-start;`};
	opacity: ${props => props.persisted === false ? 0.5 : 1};

	&:last-of-type {
		margin-bottom: 0;
	}

	&:first-of-type:not(:last-of-type) { /* if two emojis are posted back to back, don't add margin to the first one */
		margin-bottom: 0;
	}

	& + & {
		margin: 0; /* if two emojis are next to each other, no margin needed */
	}

	& + p {
		margin-top: 8px; /* if emoji is followed by a bubble, add margin to the bubble */
	}
`;

export const Byline = styled.span`
	display: inline-block;
	font-size: 11px;
	line-height: 16px;
	font-weight: ${props => props.op ? '700' : '500'};
	margin-bottom: 1px;
	margin-left: 16px;
	float: ${props => props.me ? `right;` : `left;`}
	-webkit-user-select: none; /* Chrome/Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+ */
	color: ${props => props.op ? props.theme.brand.default : props.theme.text.alt};
	/* Rules below not implemented in browsers yet */
	-o-user-select: none;
	user-select: none;
`;

export const AdminBadge = styled.span`
	color: ${({ theme }) => theme.text.reverse};
	background-color: ${props =>
  props.op ? props.theme.brand.default : props.theme.text.alt};
	text-transform: uppercase;
	padding: 2px 5px 2px 4px;
	margin-left: 4px;
	font-size: 9px;
	font-weight: 800;
	border-radius: 4px;
`;

export const ProBadge = styled(AdminBadge)`
	background: #00C384;
	padding: 2px 3px 2px 4px;
	background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%);
	cursor: pointer;
	text-transform: none;
	${props => props.tipText ? Tooltip(props) : ''};
`;
