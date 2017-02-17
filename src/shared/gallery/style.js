import styled from 'styled-components';
import { Shadow } from '../Globals';

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${({ theme }) => theme.bg.reverse};
	opacity: 0.75;
	z-index: 5;
`;

export const ActiveImage = styled.img`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	object-fit: cover;
	max-height: 90%;
	margin: auto 0;
	box-shadow: ${Shadow.high};
	z-index: 10;
`;
