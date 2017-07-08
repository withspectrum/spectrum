// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexCol } from '../../../../components/globals';

export const ImageInputWrapper = styled(FlexCol)`
  position: relative;
  flex: 0 0 auto;
  margin-top: 8px;
  margin-bottom: 24px;

  > label:nth-of-type(2) {
    position: absolute;
    bottom: -24px;
    left: 24px;
  }
`;

export const Spacer = styled.div`
  height: ${props => (props.height ? `${props.height}px` : 'auto')};
  width: ${props => (props.width ? `${props.width}px` : 'auto')};
  display: block;
`;
