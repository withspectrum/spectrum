import styled from 'styled-components';

export const Button = styled.button`
  position: relative;
	width: auto;
  color: #FFF;
  background: #403E3E;
  font-size: ${props => props.large ? '1rem' : '0.875rem'};
  font-weight: 800;
  padding: ${props => props.large ? '0.75rem 1rem' : '0.5rem 0.75rem'};
  border-radius: 8px;
  border: 1px solid #403E3E;
  outline: none;
  position: relative;
  margin: 0;
	-webkit-backface-visibility: hidden;
	transition: background 0.2s, box-shadow 0.2s, color 0.2s;

  &:hover {
  	cursor: pointer;
    border-radius: 12px;
  	box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  &:active {
  	box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  	box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  }
`;

export const ButtonOutline = styled(Button)`
	background: #fff;
	box-shadow: none;
	border: 1px solid #403E3E;
	color: #403E3E;

	&:hover {
		color: #403E3E;
  	box-shadow: none;
  }

  &:active {
  	border: 1px solid #403E3E;
  }
`;

export const ButtonLink = styled(ButtonOutline)`
	border: 1px solid rgba(255,255,255,0);
	border-radius: 0;
	padding-left: 0.1rem;
	padding-right: 0.1rem;
	box-shadow: inset 0 -3px 0 0 #fff, inset 0 -4px 0 0 #403E3E;

	&:hover {
		color: #403E3E;
		box-shadow: inset 0 -1px 0 0 #fff, inset 0 -2px 0 0 #403E3E;
  }

  &:active {
  	border: 1px solid rgba(255,255,255,0);
  }
`;

export const ButtonPrimary = styled(Button)`
	background-image: radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%);
	color: #fff;
	border: 1px solid #3819E6;
	text-shadow: 0 1px 1px rgba(0,0,0,0.2);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease-out;

	&:hover {
		color: #fff;
		background: radial-gradient(ellipse farthest-corner at top left , #7B16FF 0%, #3819E6 100%);
  	box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2);
  	transition: all 0.2s ease-in;
  }

  &:active {
  	background: radial-gradient(ellipse farthest-corner at bottom left , #7B16FF 0%, #3819E6 100%);
  }
`;

export const ButtonWarning = styled(ButtonPrimary)`
	background: linear-gradient(180deg, #FA443E, #EF3A34);
	color: #fff;
	border: 1px solid #EF3A34;

	&:hover {
		background: linear-gradient(180deg, #FA443E, #F83D36);
  }

  &:active {
  	border: 1px solid #EF3A34;
  	background: linear-gradient(180deg, #E63832, #FA443E);
  }
`;

export default {
  Button,
  ButtonOutline,
  ButtonLink,
  ButtonPrimary,
  ButtonWarning,
};
