// @flow
import React from 'react';
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

/* eslint no-eval: 0 */

export const InlineSvg = styled.svg`
  position: absolute;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  color: inherit;
  fill: currentColor;
  pointer-events: none;

  > g {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
  }
`;

export const SvgWrapper = styled.div`
  position: absolute;
  flex: none;
  z-index: ${zIndex.base};
  height: 80px;
  width: 110%;
  bottom: -4px;
  left: -5%;
  right: -5%;
  display: ${props => (props.goop === 0 ? 'none' : 'inline-block')};
  color: ${props => eval(`props.theme.${props.color}`)};
  pointer-events: none;

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 150%;
    left: -25%;
    right: -25%;
  }
`;

type Props = {
  color: string,
  goop: number,
  goopHeight: number,
};

class Goop extends React.Component<Props> {
  returnGoop() {
    switch (this.props.goop) {
      default:
      case 0:
        return null;
      case 1:
        return (
          <g>
            <path d="M1920,111.904l0,128.096l-1920,0l0,-132.536c390.745,104.115 1168.02,146.399 1763,34.536c60.63,-11.399 112.59,-21.405 157,-30.096Z" />
          </g>
        );
      case 2:
        return (
          <g>
            <path d="M1920,144.5l0,95.5l-1920,0l0,-65.5c196,-36 452.146,-15.726 657.5,8.5c229.698,27.098 870,57 1262.5,-38.5Z" />
          </g>
        );
      case 3:
        return (
          <g>
            <path d="M1920,180.5l0,59.5l-1920,0l0,-89.895c9.045,-1.833 86,-4.97 226.5,16.895c140.5,21.865 310.5,50 510,50c199.5,0 697.91,-33.156 816,-50c118.09,-16.844 308.05,-10.446 367.5,13.5Z" />
          </g>
        );
      case 4:
        return (
          <g>
            <path d="M1920,146l0,94l-1920,0l0,-77.034c93,94.034 759,60.034 983.5,21.534c224.5,-38.5 456,13.5 594,13.5c138,0 152.14,-11.31 342.5,-52Z" />
          </g>
        );
      case 5:
        return (
          <g>
            <path d="M1920,170.408l0,69.59l-1920,0l0,-70.108c16.912,-0.457 41.496,5.326 78.75,14.089c34.06,8.012 78.712,18.516 137.771,29.019c97.689,17.373 151.251,-7.434 204.304,-32.005c40.085,-18.565 79.879,-36.995 138.196,-36.995c42.888,0 96.297,12.473 159.528,27.24c136.535,31.888 318.871,74.47 539.971,25.26c240.59,-53.548 479.8,-56.485 661.48,-26.09Z" />
            <path d="M567.439,130.592c-0.66,3.489 7.503,4.22 19.289,5.275c7.461,0.668 16.373,1.466 25.419,3.176c7.616,1.44 14.477,3.149 20.302,4.599c12.022,2.995 19.63,4.889 20.356,1.051c1.077,-5.698 -17.179,-15.46 -40.514,-19.871c-23.335,-4.411 -43.775,0.072 -44.852,5.77Z" />
          </g>
        );
      case 6:
        return (
          <g>
            <path d="M1920,144.532l0,95.468l-1920,0l0,-84c90.5,58 780,52.5 980,52.5c200,0 547.69,-52.5 634,-52.5c86.31,0 152,52.5 306,-11.468Z" />
            <path d="M1485.5,159.333c18.37,-1.773 39.53,-7.468 38.5,-11.193c-1.03,-3.726 -15.25,-3.812 -39.5,-1.64c-24.25,2.172 -37.8,5.5 -36,12c1.8,6.5 18.63,2.607 37,0.833Z" />
            <path d="M1549.19,145.713c0.34,1.34 -1.57,2.969 -4.24,3.639c-2.68,0.67 -5.13,0.127 -5.46,-1.212c-0.34,-1.34 1.56,-2.969 4.24,-3.639c2.68,-0.67 5.13,-0.127 5.46,1.212Z" />
          </g>
        );
      case 7:
        return (
          <g>
            <path d="M1920,157.624l0,82.231l-1920,0l0,-106.045c54.693,-9.327 89,45.297 242,56.045c153,10.748 265.5,-30.5 411,-30.5c145.5,0 603,131.5 1267,-1.731Z" />
            <path d="M83.5,131.354c-2.5,12.5 68.5,37 148,44.5c79.5,7.5 108.103,0.808 107,-5c-1.537,-8.094 -89.5,-14.365 -136.5,-22.5c-47,-8.135 -116,-29.5 -118.5,-17Z" />
          </g>
        );
    }
  }

  render() {
    const { color = 'bg.default', goopHeight, goop } = this.props;
    return (
      <SvgWrapper
        className={'goop'}
        goopHeight={goopHeight}
        goop={goop}
        color={color}
      >
        <InlineSvg
          fillRule="evenodd"
          clipRule="evenodd"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="title"
          viewBox="0 0 1920 240"
          id={'goop'}
        >
          <title id="title">goop</title>
          {this.returnGoop()}
        </InlineSvg>
      </SvgWrapper>
    );
  }
}

export default Goop;
