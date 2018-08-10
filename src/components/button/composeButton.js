// @flow
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

const composeButton = (Component: any) => {
  const ComposedButton = props => {
    const {
      wrappedComponentRef,
      size = 'default',
      disabled = false,
      loading = false,
      fill = false,
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        disabled={disabled || loading}
        fill={fill}
        size={size}
        ref={wrappedComponentRef}
      />
    );
  };

  ComposedButton.WrappedComponent = Component;
  return hoistStatics(ComposedButton, Component);
};

export default composeButton;
