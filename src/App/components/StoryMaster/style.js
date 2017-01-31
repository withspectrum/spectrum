import styled from 'styled-components';

export const Column = styled.div`
	display: flex;
	width: 30vw;
	flex-direction: column;
	border-right: 1px solid rgba(0,0,0,0.1);
	background-color: #F5F6F7;
	height: 100%;
	position: relative;
	overflow-y: scroll;
`;

export const ScrollBody = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	z-index: 1;
	margin-top: 56px;
	`;

export const Header = styled.div`
	min-height: 48px;
	position: fixed;
	background-color: #ffffff;
	width: 30vw;
	top: 0;
	border-bottom: 1px solid rgba(0,0,0,0.1);
	z-index: 2
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px;
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