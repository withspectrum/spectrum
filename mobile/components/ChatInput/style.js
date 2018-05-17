// @flow
import { TouchableOpacity } from 'react-native';
import { Svg } from 'expo';
import React from 'react';
import styled, { withTheme } from 'styled-components/native';

const { Path, G } = Svg;

export const ChatInputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0px;
  padding: 8px 4px;
  background-color: ${props => props.theme.bg.default};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.bg.border};
`;

export const ChatInputTextInputWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  min-height: 40px;
  padding: ${props => (props.hasAttachment ? '16px' : '8px 16px')};
  border-radius: 24px;
  border-width: 1px;
  border-color: ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
`;

type SendButtonProps = {
  onPress: Function,
  size?: number,
  theme: Object,
};

export const SendButton = withTheme(
  ({ onPress, size, theme }: SendButtonProps) => {
    const actualSize = size ? size : 64;
    return (
      <TouchableOpacity onPress={onPress}>
        <Svg width={actualSize} height={actualSize} viewBox={`0 0 32 32`}>
          <G>
            <Path
              fill={theme.text.alt}
              d="M9,8l0,5.287l7.054,1.495c0.628,0.133 0.966,0.665 0.989,1.164c0,0.009 0.001,0.022 0.001,0.034c0,0.004 0,0.008 0,0.012c0,0.005 0,0.009 0,0.013c0,0.012 -0.001,0.025 -0.001,0.034c-0.023,0.498 -0.361,1.031 -0.989,1.164l-7.054,1.495l0,5.627c0.02,0.001 0.049,-0.002 0.09,-0.017c4.386,-1.524 15.41,-7.808 15.41,-8.308c0,-0.5 -11.075,-6.473 -15.41,-7.984c-0.041,-0.014 -0.07,-0.017 -0.09,-0.016Zm17.555,7.992l0,-0.011l0,-0.003c-0.011,-0.698 -0.39,-1.289 -0.925,-1.685c-3.631,-2.688 -11.512,-6.642 -15.882,-8.165c-0.624,-0.218 -1.3,-0.158 -1.843,0.185c-0.554,0.349 -0.905,0.958 -0.905,1.667l0,5.712c0,0.708 0.496,1.32 1.189,1.467l3.931,0.833l-3.931,0.834c-0.693,0.146 -1.189,0.758 -1.189,1.467l0,6.052c0,0.709 0.351,1.317 0.905,1.667c0.543,0.343 1.219,0.403 1.843,0.185c4.371,-1.527 12.29,-5.85 15.881,-8.505c0.536,-0.397 0.915,-0.987 0.925,-1.685l0,-0.003l0.001,-0.012Z"
            />
          </G>
        </Svg>
      </TouchableOpacity>
    );
  }
);
