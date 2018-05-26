// @flow
import React, { Component, type ComponentType } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import compose from 'recompose/compose';
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

type Props = {
  render: Function,
  children: ?any,
  data: {
    user?: GetUserType,
  },
};

class CurrentUserComponent extends Component<Props> {
  render() {
    const { data: { user: currentUser }, children, render } = this.props;

    return children ? children({ currentUser }) : render({ currentUser });
  }
}

export const CurrentUser = compose(getCurrentUser)(CurrentUserComponent);

export type WithCurrentUserProps = {
  currentUser: ?GetUserType,
};

export const withCurrentUser = (
  Component: ComponentType<Props>
): ComponentType<$Diff<Props, WithCurrentUserProps>> => {
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;
    return (
      <CurrentUser>
        {({ currentUser }) => {
          if (!currentUser)
            return <Component {...remainingProps} ref={wrappedComponentRef} />;

          return (
            <Component
              {...remainingProps}
              currentUser={currentUser}
              ref={wrappedComponentRef}
            />
          );
        }}
      </CurrentUser>
    );
  };

  C.WrappedComponent = Component;
  return hoistStatics(C, Component);
};
