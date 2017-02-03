import styled from 'styled-components';

export const Column = styled.div`
	display: flex;
	flex: 0 1 480px;
	min-width: 400px;
	flex-direction: column;
	border-right: 1px solid rgba(0,0,0,0.1);
	background-color: #F5F6F7;
	height: 100%;
	overflow-y: scroll;
`;

export const ScrollBody = styled.div`
	flex: 1 1 auto;
	display: flex;
	overflow-y: auto;
	overflow-x: hidden;
	flex-direction: column;
	align-items: stretch;

	> img {
		margin: 32px auto;
		transition: all 0.2s ease-out;

		&:hover {
			transform: scale(1.15);
			transition: all 0.2s ease-out;
		}
	}
	`;

export const Header = styled.div`
	display: flex;
	flex-direction: row-reverse;
	flex: 0 0 48px;
	width: 100%;
	background-color: #ffffff;
	box-shadow: 0 1px 1px rgba(0,0,0,0.1);
	align-items: center;
	align-self: flex-start;
	justify-content: space-between;
	padding: 8px;


	> img {
		flex: 0 0 32px;
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
  font-size: 12px;
  font-weight: 800;
  flex: 0 0 80px;
  height: 28px;
  line-height: 26px;
  margin-left: 4px;
  text-align: center;
  vertical-align: middle;
  border-radius: 8px;
  border: 2px solid ${props => props.member ?  `#D6E0EE` : 'transparent'};
  color: ${props => props.member ? `#D6E0EE` : `#ffffff` };
  background-color: ${props => props.member ? `transparent` : `#3819E6`};
  background-image: ${props => props.member ? `none` : `radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%)` };
  transition: all 0.2s ease-out;

  &:hover {
  	cursor: pointer;
		border-radius: 12px
		color: ${props => props.member ? '#3819E6' : '#ffffff'};
		border-color: ${props => props.member ? '#3819E6' : 'transparent'};
		transition: all 0.2s ease-in;
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

export const LoginWrapper = styled.div`
	width: 100%;
	padding: 4px;
	display: flex;
	flex-direction: column;
	align-self: stretch;
	padding: 16px;
	border-radius: 2px;
	background-color: #ffffff;
	margin: 8px;
	box-shadow: 0 2px 4px rgba(129, 148, 175, 0.2);
	transition: box-shadow 0.2s ease-in;
	width: calc(100% - 16px);

	&:hover {
		box-shadow: 0 4px 16px rgba(129, 148, 175, 0.8);
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
  color: #ffffff;
  background-color: #3819E6;
  background-image: radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%);
  transition: all 0.2s ease-in-out;

  &:hover {
  	cursor: pointer;
		border-radius: 16px
		color: #ffffff;
  }
`;