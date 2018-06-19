// @flow
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { Row } from '../../../../components/Flex';

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

export const CommunityProfileName = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme.text.default};
  margin-top: 16px;
`;

export const CommunityProfileDescription = styled.Text`
  margin-top: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.secondary};
  line-height: 22;
`;

export const CommunityProfileMemberCount = styled.Text`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${props => props.theme.text.alt};
`;

export const CommunityProfileHeader = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

export const CommunityProfileButtonContainer = styled.View``;
