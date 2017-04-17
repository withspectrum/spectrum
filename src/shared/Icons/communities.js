import React from 'react';
import styled from 'styled-components';
import { Tooltip, Onboarding } from '../Globals';

/* eslint no-eval: 0 */

export const InlineSvg = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: inherit;
  transition: fill 0.3s ease-out;
  fill: ${props => (props.subtle ? props.theme.text.alt : 'currentColor')};

  &:hover {
    transition: all 0.2s ease-in;
    transform: ${props => (props.static ? `none` : `scale(1.05)`)};
    fill: currentColor;
		cursor: pointer;
	}
`;

export const SvgWrapper = styled.div`
  display: inline-block;
  flex: 0 0 ${props => (props.size ? `${props.size}px` : '12px')};
  width: ${props => (props.size ? `${props.size}px` : '12px')};
  height: ${props => (props.size ? `${props.size}px` : '12px')};
  min-width: ${props => (props.size ? `${props.size}px` : '12px')};
  min-height: ${props => (props.size ? `${props.size}px` : '12px')};
  position: relative;
  margin-right: 4px;
  color: ${props => (props.reverse ? props.theme.text.reverse : eval(`props.theme.${props.color}`))};
  ${props => (props.tipText && !props.onboarding ? Tooltip(props) : '')};
  ${props => (props.onboarding ? Onboarding(props) : '')};
`;

class CommunityLogo extends React.Component {
  returnPath() {
    switch (this.props.icon) {
      case 'SpecFM':
        return (
          <g>
            <path d="M5.964,0.04l6,0l0,6l-3,0l0,-3l-3,0l0,-3Zm0,3l0,3l3,0l0,3l-3,0l0,3l-3,0l0,-3l-3,0l0,-3l3,0l0,-3l3,0Z" />
          </g>
        );
      case 'Spectrum':
        return (
          <g>
            <path d="M0.964,5.54c0,0.276 0.224,0.5 0.5,0.5l0.5,0c2.209,0 4,1.791 4,4l0,0.5c0,0.276 0.224,0.5 0.5,0.5l4,0c0.276,0 0.5,-0.224 0.5,-0.5l0,-0.5c0,-4.97 -4.03,-9 -9,-9l-0.5,0c-0.276,0 -0.5,0.224 -0.5,0.5l0,4Z" />
          </g>
        );
      default:
        return;
    }
  }
  render() {
    return (
      <SvgWrapper
        size={this.props.size}
        color={this.props.color}
        reverse={this.props.reverse}
        justify={this.props.location}
        tipText={this.props.tipText}
        tipLocation={this.props.tipLocation}
        onboarding={this.props.onboarding}
      >
        <InlineSvg
          fillRule="evenodd"
          clipRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="1.414"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="title"
          viewBox="0 0 12 12"
          preserveAspectRatio="xMidYMid meet"
          fit
          reverse={this.props.reverse}
          subtle={this.props.subtle}
          id={this.props.icon}
          color={this.props.color}
          static={this.props.static}
        >
          <title id="title">{this.props.icon}</title>
          {this.returnPath()}
        </InlineSvg>
      </SvgWrapper>
    );
  }
}

CommunityLogo.defaultProps = {
  size: 12,
  color: 'text.placeholder',
  reverse: false,
  subtle: false,
  static: false,
};

CommunityLogo.propTypes = {
  icon: React.PropTypes.string,
  size: React.PropTypes.number.isRequired,
  reverse: React.PropTypes.bool.isRequired,
  subtle: React.PropTypes.bool.isRequired,
  color: React.PropTypes.string.isRequired,
  static: React.PropTypes.bool.isRequired,
};

export default CommunityLogo;
