// @flow
import theme from 'shared/theme';
// $FlowFixMe
import styled from 'styled-components';
import ScrollRow from 'src/components/scrollRow';

export const Section = styled.section`
  display: flex;
  flex: 0 0 auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: ${props => (props.noPadding ? '2rem 0 0' : '2rem')};

  ${props =>
    props.noPadding &&
    `h2 {
      padding: 0 56px;
    }`};
`;

export const SectionHeader = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  margin: 32px;
  height: 2px;
`;

export const SectionHeaderNumber = styled.span`
  position: absolute;
  left: 50%;
  top: -16px;
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: ${theme.brand.default};
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 2px solid ${theme.brand.default};
  font-weight: 700;
  transform: translateX(-50%);
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  button {
    margin: 0 8px;
  }
`;

export const FriendlyError = styled.p`
  text-align: center;
  font-size: 14px;
  margin: 16px 0;
  font-weight: 600;
  color: ${theme.success.alt};
  padding: 8px 12px;
  border: 2px solid #00d6a9;
  border-radius: 8px;
  background: #ecfffb;
`;

export const Row = styled(ScrollRow)`
  max-width: 100%;
  width: 100%;
  flex: 0 0 320px;
  padding: 8px 16px 32px 16px;
  overflow-x: scroll;
  align-items: flex-start;

  &:after,
  &:before {
    content: '';
    display: inline-block;
    flex: 0 0 32px;
    align-self: stretch;
    background-color: transparent;
  }
`;
