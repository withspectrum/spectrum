import styled from 'styled-components';
import { Gradient } from '../../../shared/Globals';

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
	line-height: 20px;

	&:first-of-type {
		margin-top: 0;
	}

  a { 
  	text-decoration: underline;
  	word-wrap: break-word;
  	line-height: inherit; 
  	word-break: break-all;
  }
`;

export const BubbleGroup = styled.div`
	width: 100%;
	margin-top: 8px;

	&:first-of-type {
		margin-top: auto;
	}

	> p {

		background-color: ${props =>
  props.me ? props.theme.brand.default : props.theme.generic.default};
		background-image: ${props =>
  props.me
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : Gradient(props.theme.generic.alt, props.theme.generic.default)}
		color: ${props =>
  props.me ? props.theme.text.reverse : props.theme.text.default};
		float: ${props => props.me ? `right;` : `left;`}
		font-weight: ${props => props.me ? `500` : `400`};
		clear: both;

		&:not(:first-of-type) {
			${props =>
  props.me ? `border-top-right-radius: 4px` : `border-top-left-radius: 4px`};
		}

		&:not(:last-of-type) {
			${props =>
  props.me
    ? `border-bottom-right-radius: 4px`
    : `border-bottom-left-radius: 4px`};
		}

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
	padding: 4px;
	vertical-align: middle;
	border-radius: 16px
	margin-top: 2px;
	max-width: 60%;
	float: ${props => props.me ? `right;` : `left;`}

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
  margin-bottom: 8px;
	float: ${props => props.me ? `right;` : `left;`}
`;

export const FromName = styled.span`
	display: inline-block;
	font-size: 10px;
	line-height: 16px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.alt};
	float: ${props => props.me ? `right;` : `left;`}
`;
