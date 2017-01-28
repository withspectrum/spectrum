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
	z-index: 1;
	padding-top: 56px;
	`;

export const ActionHeader = styled.div`
	flex: 0 0 56px;
	position: fixed;
	background-color: #ffffff;
	height: 56px;
	width: 100%;
	top: 0;
	border-bottom: 1px solid rgba(0,0,0,0.1);
	z-index: 2
`;