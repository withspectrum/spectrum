import styled from 'styled-components';

export const PostWrapper = styled.div`
	display: inline-block;
	margin: 8px;
	padding: 16px;
	border-radius: 2px;
	background-color: #ffffff;
	box-shadow: 0 2px 4px rgba(129, 148, 175, 0.5);
	transition: box-shadow 0.2s ease-in;

	&:hover {
		box-shadow: 0 4px 16px rgba(129, 148, 175, 0.8);
		transition: box-shadow 0.2s ease-out;
	}
`;

export const PostBody = styled.div`
	display: inline-block;
	font-size: 14px;
`;

export const PostImg = styled.img`
	max-width: calc(100% - 0px);
	margin-top: 16px;
	border-radius: 2px;
`;