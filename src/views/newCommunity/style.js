// @flow
// $FlowFixMe
import styled from 'styled-components';
import Card from '../../components/card';

export const Container = styled(Card)`
  background-image: ${props =>
    props.bg ? `url('/img/fills/${props.bg}.svg')` : 'none'};
  background-color: #fff;
  background-size: 110% auto;
  background-repeat: ${props => (props.repeat ? 'repeat-y' : 'no-repeat')};
  background-position: ${props =>
    props.repeat ? 'center top' : 'center center'};
  width: 100%;
  height: auto;
  min-height: 160px;
  display: flex;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 24px;
  background: #fff;
  border-radius: 0 0 12px 12px;
`;

export const Title = styled.h1`
  font-weight: 900;
  color: ${props => props.theme.text.default};
  font-size: 24px;
  letter-spacing: -0.1px
  padding: 24px 24px 8px;
  text-align: ${props => (props.centered ? 'center' : 'left')};
`;

export const Description = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  line-height: 1.4;
  padding: 8px 24px 16px;
  text-align: ${props => (props.centered ? 'center' : 'left')};
`;

export const Divider = styled.div`
  border-bottom: 2px solid ${props => props.theme.border.default};
  width: 100%;
  display: block;
  padding-top: 24px;
  margin-bottom: 24px;
`;

export const ContentContainer = styled.div`padding: 0 24px 24px;`;

export const FormContainer = styled.div``;

export const Form = styled.form`
  display: block;
  flex-direction: column;
  align-self: stretch;
  flex: 1 0 100%;
  max-width: 100%;
  margin: 16px;
`;
