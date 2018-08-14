// @flow
import * as React from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import Text from '../../components/Text';

export const UserOnboardingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 72px 16px;
  background: ${props => props.theme.bg.default};
`;

export const ExploreCommunitiesWrapper = styled(ScrollView)`
  flex: 1;
  padding: 48px 16px 256px;
  background: ${props => props.theme.bg.default};
`;

export const UsernameInputWrapper = styled.View`
  position: relative;
`;

export const LoadingSpinnerWrapper = styled.View`
  position: absolute;
  top: 26px;
  right: 16px;
`;

export const UsernameInput = styled.TextInput.attrs({
  autoCapitalize: 'none',
  autoCorrect: false,
})`
  background: ${props => props.theme.bg.default};
  width: 100%;
  max-width: 100%;
  margin-top: 12px;
  padding: 12px 48px 12px 16px;
  border-width: 1px;
  border-color: ${props => props.borderColor(props.theme)};
  border-radius: 8px;
  font-size: 18px;
`;

export const ViewTitle = ({ children }: any) => {
  const customStyles = {
    marginBottom: 8,
  };

  return (
    <Text type={'largeTitle'} weight={'heavy'} style={customStyles}>
      {children}
    </Text>
  );
};

export const ViewSubtitle = ({ children }: any) => {
  const customStyles = {
    marginTop: 8,
    marginBottom: 16,
  };

  return (
    <Text type={'title3'} color={theme => theme.text.alt} style={customStyles}>
      {children}
    </Text>
  );
};

export const SaveButtonWrapper = styled.View`
  margin-bottom: 16px;
`;

export const AvailableLabel = styled.Text`
  font-size: 16px;
  color: ${props =>
    props.available ? props.theme.success.alt : props.theme.warn.alt};
  line-height: 21;
  font-weight: 500;
`;

export const AvailableLabelWrapper = styled.View`
  padding: 8px 16px 16px;
`;

export const CommunityCardListScrollView = styled(ScrollView)`
  flex: 1;
  margin-left: -16px;
  margin-right: -16px;
  padding: 32px 0;
`;
