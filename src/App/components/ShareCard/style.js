import styled from 'styled-components';

export const Body = styled.div`
	width: 100%;
`;

export const Title = styled.p`
	font-size: 1rem;
	font-weight: bold;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	text-align: center;
	width: 100%;
	color: ${({ theme }) => theme.text.alt};
`;

export const Desc = styled.p`
	font-size: 14px;
	width: 100%;
	font-weight: regular;
	margin-bottom: 8px;
	text-align: center;
	color: ${({ theme }) => theme.text.alt};
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	margin-top: 1rem;
	text-align: center;
	justify-content: center;
`;

export const Button = styled.a`
	display: flex;
	align-self: center;
	color: ${({ theme }) => theme.text.reverse};
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	padding: 0.5rem 1rem;
	background: ${props =>
  props.type === 'twitter'
    ? 'radial-gradient(ellipse farthest-corner at top left , #53D0FF 0%, #00aced 100%);'
    : 'radial-gradient(ellipse farthest-corner at top left , #5A85DF 0%, #3b5998 100%);'}

	&:first-of-type {
		margin-right: 0.5rem;
	}

	&:last-of-type {
		margin-left: 0.5rem;
	}

	&:hover {
		cursor: pointer;
	}
`;

export const Input = styled.input`
	width: 100%;
	border-radius: 4px;
	border: 2px solid ${({ theme }) => theme.border.default};
	padding: 8px 12px;
	font-size: 0.875rem;
	margin-top: 1rem;
	outline: none;
	box-shadow: none;
	-webkit-appearance: none;
	color: ${({ theme }) => theme.text.default};

	&:focus {
		border-color: ${({ theme }) => theme.brand.default};
	}
`;
