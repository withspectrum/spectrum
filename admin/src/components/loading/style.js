// @flow
// $FlowFixMe
import styled, { keyframes } from 'styled-components';

export const LoadingContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 32px;
`;

const spin = keyframes`
  to {transform: rotate(360deg);}
`;

export const Spinner = styled.span`
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  &:before {
    content: '';
    box-sizing: border-box;
    display: inline-block;
    position: ${props => (props.inline ? 'relative' : 'absolute')};
    top: ${props => (props.inline ? '0' : '50%')};
    left: ${props => (props.inline ? '0' : '50%')};
    width: ${props => (props.size !== undefined ? `${props.size}px` : '16px')};
    height: ${props => (props.size !== undefined ? `${props.size}px` : '16px')};
    margin-top: ${props => (props.size !== undefined ? `-${props.size / 2}px` : '-8px')};
    margin-left: ${props => (props.size !== undefined ? `-${props.size / 2}px` : '-8px')};
    border-radius: 50%;
    border: ${props => '2px'} solid ${props => (props.color ? eval(`props.theme.${props.color}`) : props.theme.brand.alt)};
    border-top-color: transparent;
    border-right-color: ${props => (props.color ? `props.theme.${props.color}` : props.theme.brand.alt)};
    border-bottom-color: transparent;
    animation: ${spin} 2s linear infinite;
  }
`;
