import styled from 'styled-components';
import Card from '../card';
import { FlexRow, Truncate } from '../globals';

export const StyledCard = styled(Card)`
  padding: 16px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: 1 0 100%;
  max-width: 100%;
`;

export const FormTitle = styled.h1`
  font-size: 20px;
  color: ${props => props.theme.text.default};
  font-weight: 800;
  line-height: 1.2;
  flex: 1 0 auto;
  ${Truncate}
`;

export const Subtitle = styled.h4`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  line-height: 1.3;
  width: 100%;
  ${Truncate}
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.text.default};
  padding: 8px 0 16px;
  line-height: 1.4;
`;

export const TertiaryActionContainer = styled(FlexRow)`
  justify-content: flex-start;
  flex-grow: 1;
`;

export const Actions = styled(FlexRow)`
  margin-top: 24px;
  justify-content: flex-end;

  button + button {
    margin-left: 8px;
  }
`;

export const ImgPreview = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
`;

export const Notice = styled.span`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  border-radius: 4px;
  margin-top: 24px;
  line-height: 1.4;
`;
