// @flow
import * as React from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import Text from '../../../components/Text';
import { BlurView } from 'expo';
import { isIPhoneX } from '../../../utils/platform';

export const ExploreCommunitiesWrapper = styled(ScrollView)`
  flex: 1;
  padding: 32px 16px 16px;
  background: ${props => props.theme.bg.default};
`;

export const CommunityCardListScrollView = styled(ScrollView)`
  flex: 1;
  margin-left: -16px;
  margin-right: -16px;
  padding: 32px 0;
`;

export const ContinueButtonContainer = styled(BlurView)`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  padding-bottom: ${isIPhoneX ? '32px' : '16px'};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.bg.default};
  shadow-color: ${props => props.theme.bg.default};
  shadow-opacity: 0.1;
  shadow-radius: 8;
`;

export const ExploreSectionHeader = ({ children }: any) => {
  const customStyles = {
    marginTop: 32,
  };

  return (
    <Text type={'title2'} weight={'heavy'} style={customStyles}>
      {children}
    </Text>
  );
};

export const ExploreSectionSubheader = ({ children }: any) => {
  const customStyles = {
    marginTop: 8,
  };

  return (
    <Text
      type={'headline'}
      color={theme => theme.text.alt}
      style={customStyles}
    >
      {children}
    </Text>
  );
};
