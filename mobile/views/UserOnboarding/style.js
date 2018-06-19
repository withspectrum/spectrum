// @flow
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

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

export const ViewTitle = styled.Text`
  font-size: 34px;
  letter-spacing: -0.3;
  line-height: 40;
  font-weight: 800;
  color: ${props => props.theme.text.default};
  max-width: 100%;
  margin-bottom: 8px;
`;

export const ViewSubtitle = styled.Text`
  font-size: 20px;
  width: 100%;
  max-width: 100%;
  line-height: 28;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  margin-bottom: 16px;
  margin-top: 8px;
`;

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

export const ExploreSectionHeader = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-top: 32px;
`;

export const ExploreSectionSubheader = styled(ViewSubtitle)`
  font-size: 16px;
  line-height: 20;
  margin-bottom: 0;
`;
