import styled from 'styled-components';

export const MediaInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;

export const MediaLabel = styled.label`
	border: none;
	outline: 0;
	display: inline-block;
	background: transparent;
	transition: all 0.3s ease-out;
	border-radius: 4px;
	padding: 4px;
	position: relative;
	top: 2px;
  color: ${({ theme }) => theme.text.alt};

	&:hover {
		cursor: pointer;
    color: ${({ theme }) => theme.brand.default};
	}
`;
