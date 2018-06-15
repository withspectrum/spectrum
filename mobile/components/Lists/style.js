// @flow
import { Row, Column } from '../Flex';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import TouchableOpacity from '../TouchableOpacity';

export const ListItemView = styled(TouchableOpacity)`
  flex-direction: column;
  background: ${props => props.theme.bg.default};
  position: relative;
  padding: 12px 16px;
`;

export const Divider = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 16px;
  height: 0px;
  border-bottom-color: ${props => props.theme.bg.hairline};
  border-bottom-width: ${StyleSheet.hairlineWidth};
`;

export const AvatarWrapper = styled(Column)`
  margin-right: 16px;
  justify-content: center;
  align-items: center;
`;

export const IconWrapper = styled(Column)`
  margin-right: 16px;
  justify-content: flex-start;
  align-items: center;
`;

export const TextColumnContainer = styled(Column)`
  flex: 1;
  align-items: stretch;
  justify-content: center;
`;

export const TextRowContainer = styled(Row)`
  flex: 0;
  justify-content: space-between;
  align-items: center;
`;

export const TitleTextContainer = styled(Row)`
  flex: 1;
  padding-right: 12px;
`;

export const Title = styled.Text`
  font-size: 17px;
  font-weight: 500;
  color: ${props =>
    props.color ? props.color(props.theme) : props.theme.text.default};
`;

export const Subtitle = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${props =>
    props.color ? props.color(props.theme) : props.theme.text.alt};
  line-height: 21;
`;

export const Link = styled.Text`
  font-size: 15px;
  line-height: 21;
  font-weight: 700;
  color: ${props => props.theme.text.secondary};
`;

export const TimestampTextContainer = styled(Row)``;

export const Timestamp = styled.Text`
  font-size: 16px;
  font-weight: 300;
  color: ${props => props.theme.text.placeholder};
`;

export const FacepileContainer = styled.View`
  margin-bottom: 4px;
`;

export const ViewForwardContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  right: -8px;
`;

export const LoadingSpinnerContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  right: -8px;
`;
