// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow, FlexCol, Gradient } from '../globals';

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  width: 100%;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.25;
  margin-bottom: 16px;
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
  margin-bottom: 16px;
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

export const SmallTitle = styled(Title)`
  font-size: 18px;
`;

export const SmallSubtitle = styled(Subtitle)`
  font-size: 15px;
`;

export const Cost = styled(Subtitle)`
  margin-top: 8px;
  font-weight: bold;
`;

export const NullCol = styled(FlexCol)`
  background-image: url('/img/fills/${props => (props.bg ? `${props.bg}` : 'locked')}.svg');
  background-color: transparent;
  background-size: 110% auto;
  background-repeat: ${props => (props.repeat ? 'repeat-y' : 'no-repeat')};
  background-position: ${props => (props.repeat ? 'center top' : 'center center')};
  width: 100%;
  height: auto;
  min-height: 160px;
  flex: 0 0 auto;
  padding: ${props => (props.noPadding ? '0' : '2rem')};
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

export const Profile = styled.div`
  position: relative;
  padding: 16px 0;

  img {
    border-radius: 48px;
    width: 48px;
    height: 48px;
  }

  span {
    background-color: ${({ theme }) => theme.success.default};
    background-image: ${({ theme }) => Gradient(theme.space.light, theme.success.default)};
    position: absolute;
    left: 75%;
    top: 48px;
    color: ${({ theme }) => theme.text.reverse};
    font-size: 10px;
    font-weight: 800;
    padding: 2px 4px;
    border-radius: 8px;
    line-height: 1.5;
    border: 2px solid #fff;
  }
`;

export const LargeEmoji = styled.div`
  display: flex;
  text-align: center;
  flex 1;
  padding: 16px 0 32px;
  font-size: 48px;
`;
