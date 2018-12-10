// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../viewNetworkHandler';
import getUserGithubProfile, {
  type GetUserGithbProfileType,
} from 'shared/graphql/queries/user/getUserGithubProfile';

type Props = {
  id: string,
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    user?: GetUserGithbProfileType,
  },
  render: Function,
};

class GithubProfile extends React.Component<Props> {
  render() {
    const {
      data: { user },
      render,
    } = this.props;

    if (user) {
      if (!user.githubProfile || !user.githubProfile.id) return render(null);
      return render(user.githubProfile);
    }

    return null;
  }
}

export default compose(
  getUserGithubProfile,
  viewNetworkHandler
)(GithubProfile);
