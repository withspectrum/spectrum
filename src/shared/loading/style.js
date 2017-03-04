import styled, { keyframes } from 'styled-components';

const loading = keyframes`
	  0% {
	    transform: scaleY(1);
	  }
	  100% {
	    transform: scaleY(40);
	  }
`;

export const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

export const Loader = styled.div`
	flex: 0 0 auto;
	align-self: center;
`;

export const Bar = styled.div`
	width: 8px;
  height: 1px;
  background: #3818e5;
  display: inline-block;
  margin-right: 4px;
  animation: ${loading} 0.4s infinite alternate;

  &:nth-of-type(1) {
	  animation-delay: 0.5s;
	}

	&:nth-of-type(2) {
	  animation-delay: 0.6s;
	}

	&:nth-of-type(3) {
	  animation-delay: 0.7s;
	}

	&:nth-of-type(4) {
	  animation-delay: 0.8s;
	}

	&:nth-of-type(5) {
	  animation-delay: 0.9s;
	}
`;
