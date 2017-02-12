import styled from 'styled-components'

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.6);
`

export const ActiveImage = styled.img`
	position: absolute;
	left: 50%;	
	top: 50%;
	transform: translate(-50%, -50%);
	object-fit: cover;
	max-height: 90%;
	margin: auto 0;
	box-shadow: 0 8px 20px rgba(0,0,0,0.3);
`