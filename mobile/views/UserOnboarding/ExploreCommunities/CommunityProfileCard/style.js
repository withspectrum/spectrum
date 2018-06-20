// @flow
import * as React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { Row } from '../../../../components/Flex';
import Text from '../../../../components/Text';

const { width } = Dimensions.get('window');

export const CommunityCardWrapper = styled.View`
  display: flex;
  flex: 1;
  justify-content: space-between;
  background: ${props => props.theme.bg.default};
  shadow-color: ${props => props.theme.bg.reverse};
  shadow-opacity: 0.08;
  shadow-radius: 24;
  position: relative;
  border-radius: 16px;
  width: ${width * 0.6};
  margin: 0 16px;
  padding: 16px;
`;

export const CommunityCoverPhoto = styled.Image`
  width: 100%;
  height: 72px;
  background-color: ${props => props.theme.bg.border};
`;

export const CommunityProfilePhoto = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 8px;
`;

export const CommunityProfileName = ({ children }: any) => {
  const customStyles = {
    marginTop: 16,
  };

  return (
    <Text type="headline" weight={'heavy'} style={customStyles}>
      {children}
    </Text>
  );
};

export const CommunityProfileDescription = ({ children }: any) => {
  const customStyles = {
    marginTop: 12,
  };

  return (
    <Text
      type="body"
      color={theme => theme.text.secondary}
      style={customStyles}
    >
      {children}
    </Text>
  );
};

export const CommunityProfileMemberCount = ({ children }: any) => {
  const customStyles = {
    marginTop: 8,
  };

  return (
    <Text
      type="subhead"
      weight={'semibold'}
      color={theme => theme.text.alt}
      style={customStyles}
    >
      {children}
    </Text>
  );
};

export const CommunityProfileHeader = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

export const CommunityProfileButtonContainer = styled.View``;
