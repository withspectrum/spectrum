import styled from 'styled-components';

export const Column = styled.div`
	display: flex;
	width: 30vw;
	flex-direction: column;
	border-right: 1px solid rgba(0,0,0,0.1);
	background-color: #F5F6F7;
	height: 100%;
	position: relative;
`;

export const ScrollBody = styled.div`
	overflow-y: scroll;
	height: 100%;
	position: relative;
	`;

export const ActionHeader = styled.div`
	background-color: #ffffff;
	height: 56px;
	border-bottom: 1px solid rgba(0,0,0,0.1);
`;