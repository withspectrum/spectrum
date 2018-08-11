// @flow
import React from 'react';
import styled from 'styled-components';
import Link from 'src/components/link';
import hoistStatics from 'hoist-non-react-statics';
import type { ButtonProps } from './';

export const StyledLink = styled(Link)`
  width: ${props => (props.fill ? '100%' : 'auto')};
`;
export const StyledA = styled.a`
  width: ${props => (props.fill ? '100%' : 'auto')};
`;

const composeButton = (Component: any) => {
  const ComposedButton = (props: ButtonProps) => {
    const {
      wrappedComponentRef,
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      href,
      to,
      ...rest
    } = props;

    const button = (
      <Component
        {...rest}
        disabled={disabled || loading}
        fill={fill}
        size={size}
        ref={wrappedComponentRef}
      />
    );

    if (to) {
      return (
        <StyledLink to={to} fill={fill}>
          {button}
        </StyledLink>
      );
    }

    if (href) {
      return (
        <StyledA
          fill={fill}
          href={href}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          {button}
        </StyledA>
      );
    }

    return button;
  };

  ComposedButton.WrappedComponent = Component;
  return hoistStatics(ComposedButton, Component);
};

export default composeButton;
