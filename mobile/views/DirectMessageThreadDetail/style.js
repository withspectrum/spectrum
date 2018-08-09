// @flow
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

export const Wrapper = styled(ScrollView)`
  background-color: ${props => props.theme.bg.wash};
  flex: 1;
`;
