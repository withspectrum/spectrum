// @flow
import styled from 'styled-components/native';
import TouchableOpacity from '../../TouchableOpacity';

export const Container = styled.View`
  padding: 24px 16px 8px;
`;

export const Title = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
`;

export const ActionContainer = styled(TouchableOpacity)``;

export const ActionLabel = styled(Title)``;
