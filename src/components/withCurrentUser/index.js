// @flow
import React, { Component, type ComponentType, type Node } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import compose from 'recompose/compose';
import {
  getCurrentUser,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';

type RenderFunction = ({
  currentUser?: UserInfoType,
  isLoading: boolean,
}) => Node;

type Props = {
  render?: RenderFunction,
  children?: RenderFunction,
  data: {
    user?: GetUserType,
    networkStatus: number,
  },
};

class CurrentUserComponent extends Component<Props> {
  render() {
    const {
      data: { user: currentUser, networkStatus },
      children,
      render,
    } = this.props;
    const isLoading = networkStatus === 1 || networkStatus === 2;

    if (!children && !render) return null;

    return children
      ? children({ currentUser, isLoading })
      : // $FlowIssue
        render({ currentUser, isLoading });
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
        {({ currentUser, isLoading }) => {
          return (
            <Component
              {...remainingProps}
              currentUser={currentUser ? currentUser : null}
              isLoadingCurrentUser={isLoading}
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
