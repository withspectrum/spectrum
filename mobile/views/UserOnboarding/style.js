// @flow
import styled from 'styled-components/native';

export const UserOnboardingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 72px 16px;
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
  font-size: 40px;
  line-height: 40;
  font-weight: 900;
  color: ${props => props.theme.text.default};
  margin-bottom: 16px;
`;

export const ViewSubtitle = styled.Text`
  font-size: 18px;
  line-height: 24;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  margin-bottom: 16px;
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
