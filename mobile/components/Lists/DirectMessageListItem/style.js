// @flow
import styled from 'styled-components/native';

export const MultiAvatarWrapper = styled.View`
  display: flex;
  align-items: center;
  flex: 0;
  position: relative;
  min-width: 44px;
`;

export const DoubleAvatarFirst = styled.View`
  position: relative;
  top: 8px;
  left: -8px;
  width: 36px;
  height: 36px;
  z-index: 1;
`;

export const DoubleAvatarSecond = styled.View`
  position: relative;
  bottom: 8px;
  right: -4px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 2;
  background: ${props => props.theme.bg.default};
`;

export const TripleAvatarFirst = styled.View`
  position: relative;
  top: 16px;
  right: 10px;
  width: 24px;
  height: 24px;
  z-index: 1;
  margin-top: -8px;
`;

export const TripleAvatarSecond = styled.View`
  position: relative;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 2;
  overflow: hidden;
  background: ${props => props.theme.bg.default};
`;

export const TripleAvatarThird = styled.View`
  position: relative;
  bottom: 16px;
  right: 0px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 3;
  margin-bottom: -8px;
  overflow: hidden;
  background: ${props => props.theme.bg.default};
`;

export const QuadrupleAvatarFirst = styled.View`
  position: relative;
  top: 28px;
  right: 10px;
  width: 24px;
  height: 24px;
  z-index: 1;
  margin-top: -8px;
`;

export const QuadrupleAvatarSecond = styled.View`
  position: relative;
  top: 2px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 2;
  overflow: hidden;
  background: ${props => props.theme.bg.default};
`;

export const QuadrupleAvatarThird = styled.View`
  position: relative;
  bottom: 4px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 3;
  margin-bottom: -8px;
  overflow: hidden;
  background: ${props => props.theme.bg.default};
`;

export const QuadrupleAvatarFourth = styled.View`
  position: relative;
  bottom: 24px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 3;
  margin-bottom: -8px;
  overflow: hidden;
  background: ${props => props.theme.bg.default};
`;

export const OverflowAvatar = styled.View`
  position: relative;
  bottom: 24px;
  right: -10px;
  width: 29px;
  height: 29px;
  border-radius: 15px;
  border-color: ${props => props.theme.bg.default};
  border-width: 2px;
  z-index: 3;
  margin-bottom: -8px;
  overflow: hidden;
  background: ${props => props.theme.bg.wash};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OverflowAvatarLabel = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.text.alt};
  line-height: 17;
  margin-top: -2px;
`;
