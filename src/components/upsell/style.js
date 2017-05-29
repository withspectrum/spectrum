// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow, FlexCol } from '../globals';

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  width: 100%;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.25;
  margin: 8px 0;
  padding: 0;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0 8px;
  }
`;

export const Subtitle = styled.h2`

width: 100%;
color: ${props => props.theme.text.default};
font-weight: 400;
font-size: 1rem;
line-height: 1.4;
margin-bottom: 24px;
padding: 0 24px;
color: inherit;
font-weight: 500;
text-align: center;

  b {
    font-weight: 700
  }

  a {
    color: ${props => props.theme.brand.default}
  }
`;

export const NullCol = styled(FlexCol)`
  background-image: url('/img/fills/${props => (props.bg ? `${props.bg}` : 'locked')}.svg');
  background-color: transparent;
  background-size: 110% auto;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: auto;
  min-height: 160px;
  padding: 1rem 2rem;
  justify-content: center;
  align-items: center;
  position: relative;
  align-self: center;
`;

export const NullRow = styled(FlexRow)`
  background-image: url('/img/fills/${props => (props.bg ? `${props.bg}` : 'locked')}.svg');
  background-color: transparent;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-attachment: center;
  width: 100%;
  height: auto;
  padding: 1rem 15%;
`;

export const UpgradeError = styled.p`
  color: ${props => props.theme.warn.default};
  font-size: 14px;
  text-align: center;
  margin: 16px 0 0;
`;
