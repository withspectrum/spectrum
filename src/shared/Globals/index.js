import styled, { css, keyframes } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const Gradient = (g1, g2) => {
  return css`radial-gradient(ellipse farthest-corner at top left, ${g1} 0%, ${g2} 100%)`;
};

export const Shadow = {
  low: '0 1px 2px 0px rgba(23,26,33, 0.15)',
  mid: '0 2px 4px 0px rgba(23,26,33, 0.2)',
  high: '0 4px 8px 0px rgba(23,26,33, 0.25)',
  input: 'inset 0 3px 5px rgba(23,26,33, 0.05), inset 0 0 1px rgba(23,26,33, 0.1)',
  border: '0 0 1px rgba(23,26,33, 0.3)',
  button: '0 2px 8px rgba(23,26,33, 0.15)',
};

export const Transition = {
  hover: {
    on: 'all 0.2s ease-in',
    off: 'all 0.3s ease-out',
  },
  reaction: {
    on: 'all 0.15s ease-in',
    off: 'all 0.1s ease-out',
  },
};

export const fontStack = css`
	font-family: -apple-system, BlinkMacSystemFont, 'Helvetica', 'Segoe', sans-serif
`;

const spin = keyframes`
  to {transform: rotate(360deg);}
`;

export const Spinner = styled.span`
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border: 1px solid ${props =>
  props.white ? '#fff' : props.theme.brand.default};
    border-top-color: transparent;
    border-right-color: ${props =>
  props.white ? '#fff' : props.theme.brand.alt};
    border-bottom-color: transparent;
    animation: ${spin} .6s linear infinite;
  }
`;

const buttonStyles = css`
  background-color: ${props =>
  props.disabled ? props.theme.inactive : props.theme.brand.default};
  background-image: ${props =>
  props.disabled
    ? 'none'
    : Gradient(props.theme.brand.alt, props.theme.brand.default)};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.reverse};
  transition: ${Transition.hover.off};
  padding: 12px 16px;
  width: ${props => props.width ? props.width : ''};
  white-space: nowrap;
  word-break: keep-all;

  &:hover {
    border-radius: ${props => props.disabled ? '8px' : '12px'};
    opacity: ${props => props.disabled ? '0.5' : '1'};
    transition: ${Transition.hover.on};
    cursor: pointer;
    box-shadow: ${props => props.disabled ? 'none' : Shadow.high};
  }
`;

export const Button = styled.button`
  ${buttonStyles}
`;

export const Link = styled(RouterLink)`
  ${buttonStyles}
`;

export const TextButton = styled(Button)`
	background-color: transparent;
	background-image: none;
	border: 2px solid ${props =>
  props.border ? props.theme.bg.wash : 'transparent'};
	border-radius: ${props => props.border ? '8px' : '4px'};
	font-size: 14px;
	font-weight: 600;
	color: ${props => props.color ? props.color : props.theme.text.alt};
	transition: ${Transition.hover.off};
	padding: 8px 16px;

	&:hover {
    cursor: pointer;
    border: 2px solid transparent;
		border-radius: ${props => props.border ? '12px' : '8px'};
    color: ${props => props.color ? props.color : props.theme.warn.alt};
		background-color: ${({ theme }) => theme.bg.default};
    box-shadow: none;
    transition: ${Transition.hover.on};
	}
`;

export const SocialButton = styled(Button)`
 	display: flex;
 	align-items: center;
 	padding: 8px 16px 8px 8px;
	background-color: transparent;
	font-weight: 600;
	line-height: 32px;
	vertical-align: middle;
	background-image: none;
	border-color: ${props =>
  props.type === 'facebook'
    ? props.theme.social.facebook.default
    : props.theme.social.twitter.default} ;
	color: ${props =>
  props.type === 'facebook'
    ? props.theme.social.facebook.default
    : props.theme.social.twitter.default} ;

	> svg {
		margin-right: 8px;
	}
`;

export const IconButton = styled.button`
  display: inline-block;
  appearance: none;
  background-color: transparent;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.text.default};

	&:not(:first-of-type) {
		margin-top: 24px;
	}

  a {
    text-decoration: underline;
  }
`;

export const PrefixLabel = styled.label`
  display: flex;
  width: 100%;
  margin-top: 4px;
  padding-left: 14px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.placeholder};

  > input {
  	margin-left: 2px;
  }
`;

export const Input = styled.input`
  flex: 1 0 auto;
  background: ${({ theme }) => theme.bg.default};
  font-weight: 500;
  width: 100%;
  font-size: 14px;
  border: 2px solid ${({ theme }) => theme.inactive};
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 2px;
  box-shadow: none;

  ${props => props.type === 'checkbox' &&
css`
    flex: initial;
    width: initial;
    margin-right: 0.5em;
  `}

  &::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) =>
  theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
  }
`;

export const TextArea = styled.textarea`
	flex: 1 0 auto;
	width: 100%;
  background: ${({ theme }) => theme.bg.default};
  font-weight: 500;
  font-size: 14px;
  border: 2px solid ${({ theme }) => theme.inactive};
  border-radius: 4px;
  padding: 12px;
  margin-top: 2px;
  box-shadow: none;

  &::placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &::-webkit-input-placeholder { color: ${({ theme }) =>
  theme.text.placeholder} }
  &:-moz-placeholder { color: ${({ theme }) => theme.text.placeholder} }
  &:-ms-input-placeholder { color: ${({ theme }) => theme.text.placeholder} }

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
  }
`;

export const UnderlineInput = styled.input`
		font-size: inherit;
		font-weight: inherit;
		color: ${({ theme }) => theme.text.default};
    border-bottom: 2px solid ${({ theme }) => theme.inactive};

  &:focus {
    border-color: ${({ theme }) => theme.brand.default};
  }
`;

export const H1 = styled.h1`
	${fontStack};
	color: ${({ theme }) => theme.text.default};
	font-weight: 800;
	font-size: 24px;
	line-height: 40px;
	margin: 0;
	padding: 0;
`;

export const H2 = styled.h2`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 700;
	font-size: 20px;
	line-height: 32px;
	margin: 0;
	padding: 0;
`;

export const H3 = styled.h3`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 16px;
	line-height: 24px;
	margin: 0;
	padding: 0;
`;

export const H4 = styled.h4`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	margin: 0;
	padding: 0;
`;

export const H5 = styled.h5`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 12px;
	line-height: 16px;
	margin: 0;
	padding: 0;
`;

export const H6 = styled.h6`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 600;
	text-transform: uppercase;
	font-size: 10px;
	line-height: 12px;
	margin: 0;
	padding: 0;
`;

export const P = styled.p`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	margin: 0;
	padding: 0;
`;

export const Span = styled.span`
	color: ${({ theme }) => theme.text.default};
	${fontStack};
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	margin: 0;
	padding: 0;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.spread ? 'space-between' : 'initial'};
  align-items: ${props => props.center ? 'center' : 'initial'};
  padding: ${props => props.padding ? props.padding : '0'};
  margin: ${props => props.margin ? props.margin : '0'};

  ${props =>
  props.smallCol ? `@media (max-width: 768px) { flex-direction: column }` : ''};
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.spread ? 'space-between' : 'flex-start'};
  align-items: ${props => props.center ? 'center' : 'initial'};
  padding: ${props => props.padding ? props.padding : '0'};
  margin: ${props => props.margin ? props.margin : '0'};
`;

const returnTooltip = props => {
  switch (props.tipLocation) {
    case 'top-left':
      return `
          &:after {
            bottom: calc(100% + 5px);
            right: -5px;
          }
          &:before {
            right: 5px;
            bottom: 100%
      	    border-bottom-width: 0;
      	    border-top-color: ${props.onboarding
        ? props.theme.brand.alt
        : props.theme.bg.reverse};
          }
      `;
    case 'top-right':
      return `
          &:after {
            bottom: calc(100% + 5px);
            left: -5px;
          }
          &:before {
            left: 5px;
            bottom: 100%;
      	    border-bottom-width: 0;
      	    border-top-color: ${props.onboarding
        ? props.theme.brand.alt
        : props.theme.bg.reverse};
          }
      `;
    case 'right':
    default:
      return `
          &:after {
            left: calc(100% + 5px);
            top: 50%;
            transform: translateY(-50%);
          }
          &:before{
            left: 100%;
            top: calc(50% - 5px);
            border-left-width: 0;
            border-right-color: ${props.onboarding
        ? props.theme.brand.alt
        : props.theme.bg.reverse};
          }
      `;
    case 'bottom-left':
      return `
          &:after {
            top: calc(100% + 5px);
            right: 0;
          }
          &:before {
            right: calc(50% - 5px);
            top: 100%
      	    border-top-width: 0;
      	    border-bottom-color: ${props.onboarding
        ? props.theme.brand.alt
        : props.theme.bg.reverse};
          }
      `;
    case 'bottom-right':
      return `
          &:after {
            top: calc(100% + 5px);
            left: 0;
          }
          &:before {
            right: calc(50% - 5px);
            top: 100%;
      	    border-top-width: 0;
      	    border-bottom-color: ${props.onboarding
        ? props.theme.brand.alt
        : props.theme.bg.reverse};
          }
      `;
    case 'left':
      return `
          &:after {
            right: calc(100% + 5px);
            top: 50%;
            transform: translateY(-50%);
          }
          &:before{
            right: 100%;
            top: calc(50% - 5px);
            border-right-width: 0;
            border-left-color: ${props.onboarding
        ? props.theme.brand.alt
        : props.theme.bg.reverse};
          }
      `;
  }
};

export const Tooltip = props => css`
	position: relative;

	&:after,
	&:before {
		line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    opacity: 0;
    display: block;
    text-transform: none;
	}

	&:before {
		content: '';
    z-index: 1000;
    border: 5px solid transparent;
  }

	&:after {
		content: ${props.tipText && !props.onboarding ? `'${props.tipText}'` : `''`};
    z-index: 1001;
    ${fontStack};
    font-size: 14px;
    font-weight: 500;
		min-width: 3em;
    max-width: 21em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: ${Shadow.mid};
    background: ${props.theme.bg.reverse};
    color: ${props.theme.text.reverse};
	}

  ${props.tipText && !props.onboarding ? returnTooltip(props) : ''};

	&:hover:after,
	&:hover:before {
		opacity: 1;
		transition: all 0.1s ease-in 0.1s;
  }
`;

export const Onboarding = props => css`
  position: relative;

  &:after,
  &:before {
    line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    opacity: 0;
    display: block;
  }

  &:before {
    content: '';
    z-index: 1000;
    border: 5px solid transparent;
  }

  &:after {
    content: ${props.onboarding ? `'${props.onboarding}'` : `''`};
    z-index: 1000;
    ${fontStack};
    text-align: left;
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    width: 300px;
    white-space: normal;
    overflow: hidden;
    padding: 16px;
    padding-left: 20px;
    border-radius: 12px;
    background-color: ${props.theme.bg.default};
    background: ${props.theme.bg.default} url(/img/goopy-top.svg) center top no-repeat;
    background-size: 100%;
    color: ${props.theme.text.default};
    box-shadow: 0 8px 32px rgba(23, 26, 33, 0.35);
  }

  ${props.onboarding ? returnTooltip(props) : ''};

  &:after,
  &:before {
    opacity: 1;
    transition: all 0.1s ease-in 0.1s;
  }
`;
