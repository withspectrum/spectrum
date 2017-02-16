import styled from 'styled-components';
import { Tooltip, H1, H4, Palette, Shadow } from '../../../shared/Globals'

export const ScrollBody = styled.div`
	display: flex;
	flex: 1 1 100%;
	background-color: ${Palette.bg.default};
	max-height: 100vh;
	flex-direction: column;
	overflow-y: auto;
`;

export const ContentView = styled.div`
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	padding: 32px;
`;

export const Header = styled.div`
	flex: 1 0 auto;
	align-self: flex-start;
	justify-content: space-between;
	width: 100%;
	display: flex;
	background-color: ${Palette.bg.default};
`;

export const StoryTitle = styled(H1)`
	font-size: 32px;
	line-height: 40px;
	font-weight: 800;
	color: ${Palette.text.default};
`;

export const Byline = styled(H4)`
	color: ${Palette.brand.default};
	margin-bottom: 8px;
`;

export const FlexColumn = styled.div`
	display:flex;
	flex-direction: column;
`;

export const FlexColumnEnd = styled(FlexColumn)`
	align-self: flex-end;
`;

export const TextBody = styled.p`
	font-size: 16px;
	display: inline-block;
	max-width: 640px;
	margin-top: 16px;
	margin-bottom: 32px;
	margin-right: 64px;
	line-height: 1.6;
	color: ${Palette.text.default};
`;

export const Media = styled.img`
	max-width: 50%;
	max-height: 240px;
	width: auto;
	height: auto;
	object-fit: cover;
	border-radius: 4px;
  border: 2px solid transparent;
  box-shadow: ${Shadow.border};
  &:hover {
    border-color: ${Palette.brand.alt};
  }
`;

export const HiddenInput = styled.input`
	display: none;
`;

export const Button = styled.button`
	background-color: transparent;
	${props => props.tooltip ? Tooltip(props.tooltip) : console.log(false) };
`