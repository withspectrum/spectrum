import styled from 'styled-components';
import {
  Shadow,
  Gradient,
  Tooltip,
  H2,
  H4,
  P,
  IconButton,
} from '../../shared/Globals';

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
  overflow-x: hidden;
  border-right: 2px solid ${({ theme }) => theme.border.default};
`;

export const StoryList = styled.div`
	overflow-y: scroll;
  overflow-x: hidden;
`;

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #000;
	opacity: ${props => (props.active ? '0.1' : '0')};
	transition: opacity 0.1s ease-in;
	z-index: 2;
	pointer-events: ${props => (props.active ? 'auto' : 'none')};
	width: 100vw;
	height: 100%;
`;

export const Header = styled.div`
	flex-direction: column;
	display: 'flex';
	flex: 0 0 auto;
	min-height: 48px;
	padding: 8px;
	width: 100%;
	background-color: ${({ theme }) => theme.bg.default};
	align-self: flex-start;
	align-items: flex-start;
	justify-content: flex-start;
	z-index: 1;
	box-shadow: ${Shadow.low};
	position: relative;
	z-index: 3;
`;

export const FrequencyName = styled.h2`
	margin: 0;
	font-size: 1rem;
	font-weight: 700;
`;

export const Button = styled.div`
	background-color: transparent;
`;

export const BgText = styled.p`
	display: inline-block;
	padding: 4px 32px;
	text-align: center;
	flex: 0 0 auto;
	font-weight: bold;
	font-size: 14px;
	color: ${({ theme }) => theme.text.alt};

	&:first-of-type {
		margin-top: 16px;
	}
`;

export const LoginWrapper = styled.div`
	width: 100%;
	padding: 4px;
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	align-self: stretch;
	padding: 16px;
	border-radius: 2px;
	background-color: ${({ theme }) => theme.bg.default};
	margin: 8px 8px 0 8px;
	box-shadow: ${Shadow.low};
	transition: box-shadow 0.2s ease-in;
	width: calc(100% - 16px);

	&:hover {
		box-shadow: ${Shadow.mid};
		transition: box-shadow 0.2s ease-out;
		cursor: pointer;
	}
`;

export const LoginText = styled.p`
	flex: 1 0 auto;
	display: inline-block;
	font-size: 16px;
	font-weight: 600;
	margin: 8px 8px 24px;
	text-align: center;
`;

export const LoginButton = styled.button`
	font-size: 14px;
  font-weight: 700;
  padding-left: 16px;
  padding-right: 16px;
  height: 32px;
  line-height: 28px;
  text-align: center;
  vertical-align: middle;
  border-radius: 12px;
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${({ theme }) => theme.brand.default};
  background-image: ${({ theme }) => Gradient(theme.brand.alt, theme.brand.default)};
  transition: all 0.2s ease-in-out;

  &:hover {
  	cursor: pointer;
		border-radius: 16px
		color: ${({ theme }) => theme.bg.default};;
  }
`;

export const TipButton = styled.button`
	background-color: transparent;
	${props => (props.tipText ? Tooltip(props) : '')};
`;

export const MenuButton = styled(IconButton)`
	display: none;

	@media (max-width: 768px) {
		display: inline-block;
	}
`;

export const FreqTitle = styled(H2)`
	font-weight: 800;
	font-size: 20px;
	margin-left: 8px;
	position: relative;
  text-transform: capitalize;
`;

export const FlexCol = styled.div`
	display: flex;
	flex-direction: column;
`;

export const FlexRow = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;

export const Dingus = styled.div`

`;

export const Spread = styled(FlexRow)`
	justify-content: space-between;
	margin: 0 8px;
`;

export const Actions = styled(FlexRow)`
	display: ${props => (props.visible ? 'flex' : 'none')};
	flex: 0 0 48px;
	justify-content: space-between;
	align-items: flex-start;
`;

export const Count = styled(H4)`
	margin-top: 8px;
	font-weight: 700;
`;

export const Description = styled(P)`
	margin: 8px;
`;

export const LoadingBlock = styled.div`
	display: flex;
	height: 100%;
	width: 400px;
	justify-content: center;
	align-items: center;
`;

export const NewIndicator = styled.button`
	background: ${({ theme }) => Gradient(theme.warn.alt, theme.warn.default)};
	border: none;
	font-size: 1em;
  line-height: 1.9;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	padding: 0.25em 1em;
	padding-left: 0.25em;
	padding-left: 0.25em;
	font-weight: 600;
	left: 50%;
	transform: translateX(-50%) scale(0.9);
	position: absolute;
	margin-top: 0.75em;
	box-shadow: ${Shadow.mid};
	transition: box-shadow 0.2s ease-in;
	cursor: pointer;
  z-index: 2;

	div {
		margin-right: 0.4em;
	}

	&:hover {
		box-shadow: ${Shadow.high};
	}
`;
