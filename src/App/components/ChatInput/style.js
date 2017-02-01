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
`;