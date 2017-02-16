import styled from 'styled-components'

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
		wash: '#e4edf5', 
	},
	text: {
		default: '#171A21',
		alt: '#747E8D',
		reverse: '#FFFFFF',
		placeholder: '#B2B9C6',
	},
	generic: {
		default: '#E6ECF7',
		alt: '#F6FBFF',
	},
	inactive: '#D6E0EE',
	border: {
		default: '#DFE7EF',
	},
}

export const Gradient = (g1, g2) => {
	return `radial-gradient(ellipse farthest-corner at top left, ${g1} 0%, ${g2} 100%)`
}

export const Shadow = {
	low: '0 4px 8px -2px rgba(23,26,33, 0.15)',
	mid: '0 8px 16px -4px rgba(23,26,33, 0.2)',
	high: '0 16px 32px -8px rgba(23,26,33, 0.25)',
	input: 'inset 0 3px 5px rgba(23,26,33, 0.05), inset 0 0 1px rgba(23,26,33, 0.1)',
	border: '0 0 1px rgba(23,26,33, 0.3)',
}

export const fontStack = `
	font-family: -apple-system, BlinkMacSystemFont, 'Helvetica', 'Segoe', sans-serif
`;

export const H1 = styled.h1`
	${fontStack};
	color: ${Palette.text.default};
	font-weight: 700;
	font-size: 32px;
	line-height: 40px;
	margin: 0;
	padding: 0;
`;

export const H2 = styled.h2`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 24px;
	line-height: 32px;
	margin: 0;
	padding: 0;
`;

export const H3 = styled.h3`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 16px;
	line-height: 24px;
	margin: 0;
	padding: 0;
`;

export const H4 = styled.h4`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	margin: 0;
	padding: 0;
`;

export const H5 = styled.h5`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 500;
	font-size: 12px;
	line-height: 16px;
	margin: 0;
	padding: 0;
`;

export const H6 = styled.h6`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 600;
	text-transform: uppercase;
	font-size: 10px;
	line-height: 12px;
	margin: 0;
	padding: 0;
`;

export const P = styled.p`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	margin: 0;
	padding: 0;
`;

export const Span = styled.span`
	color: ${Palette.text.default};
	${fontStack};
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
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
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: ${Shadow.mid};
    background: #333;
    color: #fff;
    bottom: calc(100% + 5px);
	}

	&:hover:after,
	&:hover:before {
		opacity: 1;
		transition: all 0.2s ease-in;
`;