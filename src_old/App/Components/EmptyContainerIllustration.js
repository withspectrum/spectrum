import styled from 'styled-components';

export const EmptyContainerIllustration = styled.div`
	min-width: 110%;
	min-height: 110%;
	position: relative;
	background: ${({ theme }) => theme.bg.default} url('/img/empty.svg') no-repeat center left;
	background-size: cover;
	opacity: 0.2;
`;

export default EmptyContainerIllustration;
