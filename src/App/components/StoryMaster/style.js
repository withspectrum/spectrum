import styled from 'styled-components';

export const Column = styled.div`
	display: flex;
	width: 30vw;
	flex-direction: column;
	border-right: 1px solid rgba(0,0,0,0.1);
	background-color: #F5F6F7;
	height: 100%;
	overflow-y: scroll;
`;

export const ScrollBody = styled.div`
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;

	> img {
		margin-top: 32px;
		transition: all 0.2s ease-out;

		&:hover {
			transform: scale(1.15);
			transition: all 0.2s ease-out;
		}
	}
	`;

export const Header = styled.div`
	display: flex;
	flex: 0 0 auto;
	width: 30vw;
	background-color: #ffffff;
	border-bottom: 1px solid rgba(0,0,0,0.1);
	align-items: center;
	align-self: flex-start;
	justify-content: space-between;
	padding: 8px 16px;

	> img {
		transition: all 0.2s ease-out;

		&:hover {
			transform: scale(1.15);
			transition: all 0.2s ease-out;
		}
	}
`;

export const Button = styled.div`
	font-size: 16px;
	padding: 8px;
	border-radius: 4px;
	flex: 0 0 auto;

	&:hover {
		box-shadow: 0 2px 4px #000000;
	}
`;

export const BgText = styled.p`
	display: inline-block;
	padding: 4px 32px;
	text-align: center;
	flex: 0 0 auto;
	font-weight: bold;
	font-size: 14px;
	color: #747E8D;

	&:first-of-type {
		margin-top: 16px;
	}
`;

export const JoinBtn = styled.button`
  font-size: 14px;
  font-weight: 700;
  flex: 0 0 80px;
  height: 32px;
  line-height: 28px;
  text-align: center;
  vertical-align: middle;
  border-radius: 12px;
  border: 2px solid ${props => props.member ?  `#D6E0EE` : 'transparent'};
  color: ${props => props.member ? `#D6E0EE` : `#ffffff` };
  background-color: ${props => props.member ? `transparent` : `#3819E6`};
  background-image: ${props => props.member ? `none` : `radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%)` };
  transition: all 0.2s ease-in-out;

  &:hover {
  	cursor: pointer;
		border-radius: 16px
		color: ${props => props.member ? '#3819E6' : '#ffffff'};
		border-color: ${props => props.member ? '#3819E6' : 'transparent'};
  }
`;

export const ComposerOverlay = styled.div`
	width: 100%;
	height: 100%;
	top: 48px;
	background-color: ${props => props.isOpen ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)'};
	pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
	transition: all 0.2s;
	z-index: 2;
`