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
	top: 47%;
	transform: translate(-50%, -50%);
	object-fit: cover;
	max-height: 90%;
	margin: auto 0 5rem;
	box-shadow: ${Shadow.high};
	z-index: 10;
`;

export const Minigallery = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	padding: 0.25rem;
	background: rgba(0,0,0,0.2);
	max-height: 3rem;
	z-index: 10;
`
export const MiniImg = styled.img`
	height: 2rem;
	border-radius: 2px;
	margin: 0.25rem;
	opacity: ${props => props.active ? 1 : 0.5};
	transition: all 0.2s ease-in-out;

	&:hover {
		transition: all 0.2s ease-in-out;
		cursor: pointer;
		opacity: ${props => props.active ? 1 : 0.7};
	}
`

export const MiniContainer = styled.div`
	display: flex;
	justify-content: center;
`