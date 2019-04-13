// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import Card from 'src/components/card';
import { MEDIA_BREAK } from 'src/components/layout';

export const Container = styled(Card)`
  background-image: ${props =>
    props.bg ? `url('/img/fills/${props.bg}.svg')` : 'none'};
  background-color: #fff;
  background-size: 110% auto;
  background-repeat: ${props => (props.repeat ? 'repeat-y' : 'no-repeat')};
  background-position: ${props =>
    props.repeat ? 'center top' : 'center center'};
  width: 100%;
  border-left: 1px solid ${theme.bg.border};
  border-right: 1px solid ${theme.bg.border};
  max-width: ${MEDIA_BREAK}px;
  height: 100%;
  min-height: 100%;
  min-height: 160px;
  display: flex;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-left: 0;
    border-right: 0;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 2px solid ${theme.bg.border};
  padding: 24px;
  background: #fff;
  border-radius: 0 0 12px 12px;
`;

export const Title = styled.h1`
  font-weight: 900;
  color: ${theme.text.default};
  font-size: 24px;
  letter-spacing: -0.1px;
  padding: 24px 24px 8px;
  text-align: ${props => (props.centered ? 'center' : 'left')};
`;

export const Description = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.text.alt};
  line-height: 1.4;
  padding: 8px 24px 16px;
  text-align: ${props => (props.centered ? 'center' : 'left')};
`;

export const Divider = styled.div`
  border-bottom: 2px solid ${theme.bg.border};
  width: 100%;
  display: block;
  padding-top: 24px;
  margin-bottom: 24px;
`;

export const ContentContainer = styled.div`
  padding: 0 24px 24px;
`;

export const FormContainer = styled.div``;

export const Form = styled.form`
  display: block;
  flex-direction: column;
  align-self: stretch;
  flex: 1 0 100%;
  max-width: 100%;
  margin: 16px;
`;
