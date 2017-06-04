// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow, Transition } from '../../globals';

export const Row = styled(FlexRow)`
  margin: 16px 24px;
`;

export const HiddenInput = styled.input`
  visibility: hidden;
  height: 0px;
  width: 0px;
`;

export const ImageInputLabel = styled.label`
  position: relative;
  height: 48px;
  width: 48px;
  border-radius: 8px;
`;

export const ProfileImage = styled.img`
  display: block;
  margin: 0 auto;
  z-index: 9;
  width: 48px;
  height: 48px;
  border-radius: 8px;
`;

export const InputOverlay = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.text.alt};
  color: ${({ theme }) => theme.text.reverse};
  opacity: 0.25;
  padding: 8px;
  border-radius: 8px;
  transition: ${Transition.hover.off};

  &:hover {
    background-color: ${({ theme }) => theme.brand.alt};
    opacity: 0.85;
    transition: ${Transition.hover.on};
  }
`;
