import styled from 'styled-components';
import { Shadow } from '../globals';

export const GalleryWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
`;

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${({ theme }) => theme.bg.reverse};
	opacity: 0.95;
	z-index: 1000;
`;

export const ActiveImage = styled.img`
	position: absolute;
	left: 50%;
	top: 47%;
	transform: translate(-50%, -50%);
	object-fit: cover;
	max-height: 90%;
	max-width: 100%;
	margin: auto 0 5rem;
	box-shadow: ${Shadow.high};
	z-index: 1001;
`;

export const Minigallery = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	padding: 0.25rem;
	background: #000;
	max-height: 3rem;
	z-index: 1002;


`;
export const MiniImg = styled.img`
	height: 2rem;
	border-radius: 2px;
	margin: 0.25rem;
	opacity: ${props => (props.active ? 1 : 0.5)};
	transition: all 0.2s ease-in-out;

	&:hover {
		transition: all 0.2s ease-in-out;
		cursor: pointer;
		opacity: ${props => (props.active ? 1 : 0.7)};
	}
`;

export const MiniContainer = styled.div`
	display: flex;
	justify-content: center;

	@media (max-width: 768px) {
    justify-content: flex-start;
    overflow-x: scroll;
  }
`;

export const CloseButton = styled.button`
	position: absolute;
	-webkit-appearance: none;
	top: 4px;
	right: 4px;
	padding: 8px 12px;
	border-radius: 23px;
	background: #000;
	color: rgba(255,255,255,0.8);
	font-size: 20px;
	font-weight: 400;
	text-transform: uppercase;
	z-index: 1002;
	cursor: pointer;

	&:hover {
		color: #fff;
	}
`;
