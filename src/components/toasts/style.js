// @flow
// $FlowFixMe
import styled, { keyframes } from 'styled-components';
import { zIndex, Gradient } from '../globals';

export const Container = styled.div`
  position: fixed;
  top: 48px;
  right: 0;
  padding: 16px;
  width: 100%;
  height: 100%;
  max-width: 256px;
  background: transparent;
  pointer-events: none;
  z-index: ${zIndex.toast};
`;

const toastFade = keyframes`
	0% {
		opacity: 0;
    top: 8px;
	}
	5% {
		opacity: 1;
    top: 0;
	}
  95% {
		opacity: 1;
    top: 0;
	}
  100% {
    opacity: 0;
    top: -4px;
  }
`;

// TODO: refine toast styling

const Toast = styled.div`
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  display: block;
  margin-bottom: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  position: relative;
  animation-duration: ${props => `${props.timeout}ms` || '3s'};
  animation-fill-mode: forwards;
  animation-name: ${toastFade};
  animation-timing-function: linear;
`;

export const ErrorToast = styled(Toast)`
  background-color: ${props => props.theme.warn.default};
  background-image: ${props =>
    Gradient(props.theme.warn.alt, props.theme.warn.default)};
`;

export const SuccessToast = styled(Toast)`
  background-color: ${props => props.theme.success.default};
  background-image: ${props =>
    Gradient(props.theme.success.alt, props.theme.success.default)};
`;

export const NeutralToast = styled(Toast)`
  background-color: ${props => props.theme.text.alt};
  background-image: ${props =>
    Gradient(props.theme.text.placeholder, props.theme.text.alt)};
`;
