import styled from 'styled-components';

export const Header = styled.div`
	flex: 0 0 48px;
	align-self: flex-start;
	width: 100%;
	color: #ffffff;
	padding: 16px;
	background-color: #10172A;
	background-image: radial-gradient(ellipse farthest-corner at top left, #10172A 0%, #363A4F 100%);
`;

export const StoryMeta = styled.div`
  display: block;
  overflow: auto;
`

export const AuthorName = styled.small`
  display: block;
  overflow: auto;
  text-indent: 1rem;
`

export const StoryTitle = styled.h4`
	font-weight: bold;
  line-height: 20px;
  text-indent: 1rem;
	font-size: 16px;
`;

export const StoryDescription = styled.p`
	font-weight: 400;
	font-size: 12px;
`;

export const Avatar = styled.img`
	display: block;
  float: left;
  height: 40px;
  width: 40px;
	border-radius: 12px;
	box-shadow: 0 0 1px rgba(0,0,0,0.3);
`;

export const Media = styled.img`
	width: 100px;
	margin: 8px 8px 0 0;
	border-radius: 4px;
  border: 2px solid transparent;
  &:hover {
    border-color: #4422ED;
  }
`;

export const ViewContainer = styled.div`
	display: flex;
	flex: 0 0 54vw;
	height: 100%;
	flex-direction: column;
`;

export const LogicContainer = styled.div`
	flex: 1 0 auto;
	max-height: 100%;
	align-self: stretch;
	flex-direction: column;
	display: flex;
`;

export const NullContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	background: #F5F6F7;
`

export const NullText = styled.h1`
	position: relative;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0 auto;
	display: inline-block;
	font-size: 2rem;
	font-weight: 800;
	text-shadow: 0px 1px 0px rgba(255,255,255,0.3);
	color: #c9ccd0;
`
