// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Avatar from '../../../components/Avatar';
import { withNavigation } from 'react-navigation';
import type { Navigation } from '../../../utils/types';
import type { CommunityInfoType } from '../../../../shared/graphql/fragments/community/communityInfo';
import {
  CommunityHeaderTouchableWrapper,
  CommunityHeaderContainer,
  CommunityName,
} from '../style';

type Props = {
  community: CommunityInfoType,
  navigation: Navigation,
};

class CommunityHeader extends React.Component<Props> {
  render() {
    const { community, navigation } = this.props;
    return (
      <CommunityHeaderTouchableWrapper
        onPress={() => navigation.navigate(`Community`, { id: community.id })}
      >
        <CommunityHeaderContainer>
          <Avatar src={community.profilePhoto} size={32} radius={6} />
          <CommunityName>{community.name}</CommunityName>
        </CommunityHeaderContainer>
      </CommunityHeaderTouchableWrapper>
    );
  }
}

export default compose(withNavigation)(CommunityHeader);
