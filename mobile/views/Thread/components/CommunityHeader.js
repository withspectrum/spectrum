// @flow
import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import Text from '../../../components/Text';
import type { CommunityInfoType } from '../../../../shared/graphql/fragments/community/communityInfo';

const CommunityHeaderWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 14px 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.bg.border};
`;

type Props = {
  community: CommunityInfoType,
};

// TODO(@mxstbr): Make touchable and link to community view
export default ({ community }: Props) => {
  return (
    <CommunityHeaderWrapper>
      <Image
        source={{ uri: community.profilePhoto }}
        style={{ height: 40, width: 40, marginRight: 8 }}
      />
      <Text bold type="title3">
        {community.name}
      </Text>
    </CommunityHeaderWrapper>
  );
};
