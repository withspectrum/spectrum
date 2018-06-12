// @flow
import styled from 'styled-components/native';
import { isIPhoneX } from '../../utils/platform';
import TouchableHighlight from '../TouchableHighlight';
import { Animated, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const Container = styled.View`
  position: absolute;
  bottom: ${isIPhoneX() ? '82px' : '48px'};
  left: 0;
  right: 0;
  width: 100%;
  height: 48px;
  z-index: 1;
  overflow: hidden;
`;

export const ToastWrapper = styled(TouchableHighlight)`
  display: flex;
  padding: 12px 8px 12px 16px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  position: relative;
`;

export const IconContainer = styled.View`
  margin-right: 8px;
`;

export const ToastLabel = styled(Animated.Text)`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.color(props.theme)};
  display: flex;
  flex: 1;
`;

export const ViewForwardContainer = styled.View`
  display: flex;
  align-content: flex-end;
  justify-content: flex-end;
  margin-left: 4px;
`;

export const ToastContainer = styled(Animated.View)`
  display: flex;
  flex: 1;
  height: 48px;
  width: ${width + 32}px;
  padding: 0 16px;
`;
