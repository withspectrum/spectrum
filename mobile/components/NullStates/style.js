// @flow
import styled from 'styled-components/native';

export const FullscreenNullStateWrapper = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const FullscreenNullStateContent = styled.View`
  padding: 32px;
`;

export const FullscreenNullStateIcon = styled.View`
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FullscreenNullStateTitle = styled.Text`
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const FullscreenNullStateSubtitle = styled.Text`
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.secondary};
`;

export const FullscreenNullStateChildren = styled.View``;
