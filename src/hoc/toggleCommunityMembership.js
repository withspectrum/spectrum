// @flow
import { Component, createElement } from 'react';
// FlowFixMe
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { track } from '../helpers/events';
import { addToastWithTimeout } from '../actions/toasts';
import { toggleCommunityMembershipMutation } from '../api/community';

export const toggleCommunityMembership = WrappedComponent => {
  class ToggleCommunity extends Component {
    state: {
      isLoading: boolean,
    };

    constructor() {
      super();

      this.state = {
        isLoading: false,
      };
    }

    toggle = communityId => {
      const { toggleCommunityMembership, dispatch } = this.props;

      this.setState({
        isLoading: true,
      });

      toggleCommunityMembership({ communityId })
        .then(({ data: { toggleCommunityMembership } }) => {
          this.setState({
            isLoading: false,
          });

          const isMember =
            toggleCommunityMembership.communityPermissions.isMember;

          track('community', isMember ? 'joined' : 'unjoined', null);

          const str = isMember
            ? `Joined ${toggleCommunityMembership.name}!`
            : `Left ${toggleCommunityMembership.name}.`;

          const type = isMember ? 'success' : 'neutral';
          dispatch(addToastWithTimeout(type, str));
        })
        .catch(err => {
          this.setState({
            isLoading: false,
          });

          dispatch(addToastWithTimeout('error', err.message));
        });
    };

    render() {
      const props = Object.assign({}, this.props);
      props.toggle = this.toggle;
      props.isLoading = this.state.isLoading;
      return createElement(WrappedComponent, props);
    }
  }

  // Make sure we preserve any custom statics on the original component.
  return compose(toggleCommunityMembershipMutation, connect(), ToggleCommunity)(
    WrappedComponent
  );
};
