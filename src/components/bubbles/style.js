// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Gradient, Transition } from '../globals';

export const TextBubble = styled.p`
  padding: 8px 16px;
  vertical-align: middle;
  border-radius: 16px;
  font-size: 14px;
  line-height: 20px;
  opacity: ${props => (props.persisted === false ? 0.5 : 1)};
  transition: opacity 0.2s ease-out;
  background-color: ${props => (props.me ? props.theme.brand.default : props.theme.generic.default)};
  background-image: ${props => (props.me ? Gradient(props.theme.brand.alt, props.theme.brand.default) : Gradient(props.theme.generic.alt, props.theme.generic.default))}
  color: ${props => (props.me ? props.theme.text.reverse : props.theme.text.default)};
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)}
  font-weight: ${props => (props.me ? `500` : `400`)};
  clear: both;
  word-wrap: normal;
  word-break: normal;

  & + & {
    margin-top: 2px;
  }

  a {
    text-decoration: underline;
    word-break: break-word;
  }

  &::selection {
    background-color: ${props => (props.me ? props.theme.text.default : props.theme.brand.alt)};
  }
`;

export const Emoji = styled.div`
  font-size: 40px;
  padding: 4px 0 8px;
  clear: both;
  display: block;
  margin-top: 8px;
  margin-bottom: 12px;
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  opacity: ${props => (props.persisted === false ? 0.5 : 1)};

  &:last-of-type {
    margin-bottom: 0;
  }

  &:first-of-type:not(:last-of-type) { /* if two emojis are posted back to back, don't add margin to the first one */
    margin-bottom: 0;
  }

  & + & {
    margin: 0; /* if two emojis are next to each other, no margin needed */
  }

  & + img {
    margin-top: 8px; /* if emoj is followed by an image */
    margin-bottom: 8px;
  }

  & + p {
    margin-top: 8px; /* if emoji is followed by a bubble, add margin to the bubble */
  }
`;

export const ImageBubble = styled.img`
  display: block;
  clear: both;
  flex: 0 0 auto;
  vertical-align: middle;
  border-radius: 16px;
  max-width: 100%;
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  opacity: ${props => (props.persisted === false ? 0.5 : 1)};
  border: 1px solid #f6f7f8;
`;

export const Reaction = styled.b`
	position: absolute;
	bottom: 0;
	${props => (props.me ? 'right: calc(100% - 8px)' : 'left: calc(100% - 8px)')};
  min-width: ${props => (props.hasCount ? '44px' : 'auto')};
	max-width: ${props => (props.hasCount ? '100%' : '12px')};
	max-height: ${props => (props.hasCount ? '24px' : '12px')};
  color: ${props => props.theme.text.reverse};
	border: 2px solid #fff;
	border-radius: ${props => (props.hasCount ? '24px' : '8px')};

	${props => (props.hasCount ? `background-color: ${props.active ? props.theme.warn.default : props.theme.text.alt};
		background-image: ${props.active ? Gradient(props.theme.warn.alt, props.theme.warn.default) : 'none'}
			` : `background-color: ${props.theme.border.default};
		background-image: none;`)}

	padding: ${props => (props.hasCount ? '0 10px 0 6px' : '0')};
	display: flex;
	flex-direction: flex-row;
	transition: ${Transition.reaction.on};
	display: ${props => (props.hide ? 'none' : 'auto')};

	i { /* count */
		position: relative;
		transform: ${props => (props.hasCount ? 'translateX(0)' : 'translateX(-16px)')};
		opacity: ${props => (props.hasCount ? '1' : '0')};
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
		transform: ${props => (props.hasCount ? 'scale(1)' : 'scale(0)')};
		transition: ${Transition.reaction.off};
	}

	&:hover {
		max-width: 100px;
		max-height: 24px;
		border-radius: 24px;
		padding: 0 10px 0 6px;
		background: ${props => (props.active ? props.theme.warn.default : props.theme.text.alt)};
		background-image: ${props => (props.active ? Gradient(props.theme.warn.alt, props.theme.warn.default) : Gradient(props.theme.text.alt, props.theme.text.alt))}
		cursor: pointer;
		transform: ${props => (props.active ? 'translateY(-2px)' : 'none')};
		box-shadow: ${props => (props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};

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
