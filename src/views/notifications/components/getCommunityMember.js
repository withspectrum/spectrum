// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import getCommunityMemberQuery from 'shared/graphql/queries/communityMember/getCommunityMember';

type Props = {
  userId: string,
  communityId: string,
  render: Function,
  data: Object,
};

class GetCommunityMember extends React.Component<Props> {
  render() {
    if (!this.props.data.communityMember) {
      return this.props.render({ communityMember: null });
    }

    return this.props.render({
      communityMember: this.props.data.communityMember,
    });
  }
}

export default compose(getCommunityMemberQuery)(GetCommunityMember);
