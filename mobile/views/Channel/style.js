// @flow
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const Wrapper = styled.View`
  background-color: ${props => props.theme.bg.default};
  flex: 1;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  width: ${width};
`;

export const CoverPhotoContainer = styled.View`
  width: ${width};
  height: 124px;
  display: flex;
  align-self: stretch;
`;

export const CoverPhoto = styled.Image`
  width: ${width};
  height: 124px;
`;

export const CoverPhotoFill = styled.View`
  width: ${width};
  height: 124px;
  background: ${props => props.theme.brand.alt};
`;

export const ProfilePhotoContainer = styled.View`
  width: ${width};
  display: flex;
  justify-content: flex-start;
  padding: 0 16px;
  position: relative;
  top: -32px;
  margin-bottom: -24px;
`;

export const ProfilePhoto = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  border-width: 3px;
  border-color: ${props => props.theme.bg.default};
  shadow-color: ${props => props.theme.bg.default};
  shadow-opacity: 1;
  shadow-radius: 4;
`;

export const ProfileDetailsContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: ${width};
  padding: 0 24px;
`;

export const Name = styled.Text`
  font-weight: 800;
  color: ${props => props.theme.text.default};
  font-size: 20px;
`;

export const Username = styled.Text`
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  font-size: 16px;
  margin-bottom: 4px;
`;

export const Description = styled.Text`
  font-weight: 400;
  color: ${props => props.theme.text.default};
  font-size: 16px;
  margin-top: 8px;
`;

export const ThreadFeedDivider = styled.View`
  height: 32px;
  border-bottom-color: ${props => props.theme.bg.border};
  border-bottom-width: 1px;
`;
