import styled from 'styled-components';

export const Header = styled.div`
	position: fixed;
	min-height: 48px;
	width: 100%;
	color: #ffffff;
	padding: 16px;
	background-color: #10172A;
	background-image: radial-gradient(ellipse farthest-corner at top left, #10172A 0%, #363A4F 100%);
`;

export const StoryTitle = styled.span`
	font-weight: bold;
	font-size: 16px;
`;

export const ViewContainer = styled.div`
	display: flex;
	width: 54vw;
	height: 100%;
	flex-direction: column;
`;