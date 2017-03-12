import styled from 'styled-components';
import { Tooltip, H1, H4, Shadow } from '../../../shared/Globals';

export const ScrollBody = styled.div`
	display: flex;
	flex: 1 1 100%;
	background-color: ${({ theme }) => theme.bg.default};
	max-height: calc(100% - 60px);
	flex-direction: column;
	overflow-y: scroll;

	@media (max-width: 768px) {
    width: 100%;
    flex: 1 0 100%;
  }
`;

export const ContentView = styled.div`
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	padding: 32px;

	@media (max-width: 768px) {
		padding: 16px;
		padding-top: 68px;
	}
`;

export const Header = styled.div`
	flex: 1 0 auto;
	align-self: flex-start;
	justify-content: space-between;
	width: 100%;
	display: flex;
	background-color: ${({ theme }) => theme.bg.default};
`;

export const StoryTitle = styled(H1)`
	font-size: 32px;
	line-height: 40px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.default};
`;

export const Byline = styled(H4)`
	color: ${({ theme }) => theme.brand.default};
	margin-bottom: 8px;
`;

export const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
`;

export const Flex = styled.div`
	display: flex;
	flex: 1 1 auto;
`;

export const FlexColumnEnd = styled(FlexColumn)`
	align-self: flex-start;
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
    border-color: ${({ theme }) => theme.brand.alt};
  }
`;

export const HiddenInput = styled.input`
	display: none;
`;

export const HiddenLabel = styled.span`
	display: inline-block;
	width: 32px;
	${props => props.tipText ? Tooltip(props) : console.log('No Tooltip')};
`;

export const HiddenButton = styled.button`
	background-color: transparent;
	position: relative;
	${props => props.tipText ? Tooltip(props) : console.log('No Tooltip')};
`;

export const BackArrow = styled.span`
	margin-bottom: 16px;
	width: 100%;
	background: #fff;
	box-shadow: ${Shadow.low};
	height: 48px;
	align-items: center;
	display: none;
	padding-left: 8px;

	@media (max-width: 768px) {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}
`;

export const DeleteConfirm = styled.span`
	position: absolute;
	background: ${props => props.theme.warn.default};
	padding: 8px;
	border-radius: 4px;
	width: 115px;
	color: #fff;
	font-size: 13px;
	font-weight: 700;
	pointer-events: ${props => props.visible ? 'auto' : 'none'};
	opacity: ${props => props.visible ? '1' : '0'};
	right: ${props => props.visible ? '38px' : '28px'};
	transition: all 0.2s;

	&:hover {
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		transition: all 0.2s;
	}
`;
