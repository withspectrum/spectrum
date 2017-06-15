import styled from 'styled-components';
import Card from '../card';
import { FlexRow, FlexCol, Truncate } from '../globals';

export const StyledCard = styled(Card)`
  padding: 16px;
`;

export const Form = styled.form`
  display: inline-block;
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

  a {
    color: ${props => props.theme.brand.default};
  }
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

export const PhotoPreview = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  background-image: url('${props => props.src}')
`;

export const GeneralNotice = styled.span`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  border-radius: 4px;
  margin-top: 24px;
  line-height: 1.4;
  display: inline-block;
`;

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

export const Location = styled(FlexRow)`
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};
  font-size: 14px;
  margin-bottom: 8px;

  > div {
    color: ${({ theme }) => theme.text.placeholder};
  }

  > span {
    padding: 0 4px;
    color: ${({ theme }) => theme.text.placeholder};
  }

  > a:hover {
    color: ${({ theme }) => theme.brand.alt};
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
