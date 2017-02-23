import styled from 'styled-components';

export const TextBubble = styled.p`
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
