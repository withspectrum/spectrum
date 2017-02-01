import styled from 'styled-components';

export const Form = styled.form`
	flex: 1 0 auto;
	width: 100%;
	display: flex;
	align-items: stretch;
`;

export const Input = styled.input`
	flex: 1 0 auto;
	font-size: 14px;
	line-height: 32px
	padding: 4px 16px;
	border: 1px solid rgba(129, 148, 175, 0.4);
	border-right: none;
	border-radius: 8px 0 0 8px;
	box-shadow: inset 0 1px 4px rgba(129, 148, 175, 0.2)
`;

export const Button = styled.button`
	flex: 0 0 72px;
	height: 100%;
	color: #ffffff;
	font-weight: bold;
	padding-top: 2px;
	font-size: 18px;
	border-radius: 0 8px 8px 0;
	background-color: #3819E6;
	background-image: radial-gradient(ellipse farthest-corner at top left, #7B16FF 0%, #3819E6 100%);
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	padding: 8px;
	background-color: #F5F6F7;
	border-top: 1px solid rgba(129, 148, 175, 0.2);
`;

export const LoginWrapper = styled.div`
	width: 100%;
	padding: 4px;
	display: flex;
	align-self: stretch;
`;

export const LoginText = styled.p`
	flex: 1 0 auto;
	display: inline-block;
	font-size: 14px;
	font-weight: 600;
	margin: 8px;
`;

export const LoginButton = styled.button`
	font-size: 14px;
  font-weight: 700;
  flex: 0 0 80px;
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