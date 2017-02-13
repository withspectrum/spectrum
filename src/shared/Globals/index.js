import styled from 'styled-components'

export const Scale = (n) => {
	const unit = '8px';
	return `calc(${n} * ${unit})`
}

export const Palette = {
	brand: {
		default: '#3818E5',
		alt: '#7B16FF',
	},
	warn: {
		default: '#E3353C',
		alt: '#E2197A',
	},
	success: {
		default: '#00C383',
		alt: '#03AAFB',
	},
	bg: {
		default: '#FFFFFF',
		reverse: '#171A21',
		wash: '#F6FBFF', 
	},
	text: {
		default: '#171A21',
		alt: '#747E8D',
		reverse: '#FFFFFF',
	},
	generic: {
		default: '#D8E3F2',
		alt: '#E2E9F4',
	},
	inactive: '#D6E0EE',
}

export const Gradient = (type) => {

}

const fontStack = `
	font-family: -apple-system, BlinkMacSystemFont, sans-serif
`;

export const H1 = styled.h1`
	${fontStack};
	color: ${Palette.text.default};
	font-weight: 700;
	font-size: ${Scale(3)};
	line-height: ${Scale(3)};
	margin: 0;
	padding: 0;
`;

export const H2 = styled.h2`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: ${Scale(2)};
	line-height: ${Scale(2)};
	margin: 0;
	padding: 0;
`;

export const H3 = styled.h3`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: ${Scale(1.5)};
	line-height: ${Scale(2)};
	margin: 0;
	padding: 0;
`;

export const H4 = styled.h4`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: ${Scale(1.25)};
	line-height: ${Scale(1.5)};
	margin: 0;
	padding: 0;
`;

export const H5 = styled.h5`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: ${Scale(1)};
	line-height: ${Scale(1)};
	margin: 0;
	padding: 0;
`;

export const H6 = styled.h6`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 600;
	text-transform: uppercase;
	font-size: ${Scale(1)};
	line-height: ${Scale(1)};
	margin: 0;
	padding: 0;
`;

export const P = styled.p`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 400;
	font-size: ${Scale(1.75)};
	line-height: ${Scale(2.5)};
	margin: 0;
	padding: 0;
`;

export const Span = styled.span`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 400;
	font-size: ${Scale(1.75)};
	line-height: ${Scale(2.5)};
	margin: 0;
	padding: 0;
`;

export const Tooltip = (text) => `
	position: relative;

	@keyframes tooltips-vert {
	  to {
	    opacity: .9;
	    transform: translate(-50%, 0);
	  }
	}

	&:after,
	&:before {
		line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    opacity: 0;
    display: ${text ? `block` : `none !important`};
	}

	&:before {
		content: '';
    z-index: 1001;
    border: 5px solid transparent;
    bottom: 100%;
    border-bottom-width: 0;
    border-top-color: #333;
    left: 50%;
    transform: translate(-50%, 0px);
	}

	&:after {
		content: ${text ? `'${text}'` : `''` };
    z-index: 1000;
    ${fontStack};
		min-width: 3em;
    max-width: 21em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: ${Scale(1)} ${Scale(1.5)};
    border-radius: ${Scale(1)};
    box-shadow: 0 ${Scale(2)} ${Scale(4)} ${Scale(-1)} rgba(0, 0, 0, 0.35);
    background: #333;
    color: #fff;
    bottom: calc(100% + 5px);
	}

	&:hover:after,
	&:hover:before {
		opacity: 1;
		transition: all 0.2s ease-in;
`;