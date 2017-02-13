import styled from 'styled-components'
import { Palette, Scale } from '../../../shared/Globals'

export const Header = styled.div`
	flex: 0 0 48px;
	align-self: flex-start;
	width: 100%;
	color: #ffffff;
	display: flex;
	align-items: center;
	background-color: #10172A;
	background-image: radial-gradient(ellipse farthest-corner at top left, #10172A 0%, #363A4F 100%);
`;

export const ViewContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
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

export const StoryTitle = styled.h4`
	font-weight: bold;
  line-height: 20px;
  padding-left: ${Scale(2)};
	font-size: 16px;
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
