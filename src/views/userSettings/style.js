// @flow
import styled from 'styled-components';
import { FlexRow, FlexCol } from 'src/components/globals';

export const EmailListItem = styled.div`
  padding: 8px 0 16px;
  border-bottom: 2px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }

  input {
    margin-right: 8px;
  }
`;

export const CheckboxContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const View = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Form = styled.form`
  display: inline-block;
  flex-direction: column;
  align-self: stretch;
  flex: none;
  max-width: 100%;
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
  justify-content: flex-start;
  flex-direction: row-reverse;
  border-top: 1px solid ${props => props.theme.bg.border};
  padding-top: 16px;

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

export const GithubSignin = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  a {
    margin-top: 8px;
  }
`;
