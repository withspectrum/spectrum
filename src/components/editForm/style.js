import styled from 'styled-components';
import theme from 'shared/theme';
import Card from 'src/components/card';
import { FlexRow, FlexCol, Truncate } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const StyledCard = styled(Card)`
  padding: 16px;
`;

export const Form = styled.form`
  display: inline-block;
  flex-direction: column;
  align-self: stretch;
  flex: none;
  max-width: 100%;
`;

export const FormTitle = styled.h1`
  font-size: 20px;
  color: ${theme.text.default};
  font-weight: 800;
  line-height: 1.2;
  flex: 1 0 auto;
  ${Truncate};
`;

export const Subtitle = styled.h4`
  font-size: 14px;
  color: ${theme.text.alt};
  line-height: 1.3;
  width: 100%;
  ${Truncate};
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${theme.text.default};
  padding: 8px 0 16px;
  line-height: 1.4;

  a {
    color: ${theme.brand.default};
  }
`;

export const TertiaryActionContainer = styled(FlexRow)`
  justify-content: flex-start;
  flex-grow: 1;
`;

export const DeleteCoverWrapper = styled(FlexRow)`
  justify-content: flex-end;
  flex-grow: 1;
  height: 0px;
`;

export const DeleteCoverButton = styled.button`
  position: relative;
  top: 7px;
  left: 10px;
  background-color: ${theme.text.placeholder};
  color: ${theme.text.reverse};
  border: none;
  border-radius: 50%;
  outline: none;
  padding: 4px;
  height: 24px;
  width: 24px;
  cursor: pointer;
  z-index: 8;
  &:hover {
    background-color: ${theme.warn.alt};
  }
`;

export const Actions = styled(FlexRow)`
  margin: 24px -16px 0;
  width: calc(100% + 32px);
  padding: 16px 16px 0;
  justify-content: flex-start;
  flex-direction: row-reverse;
  border-top: 1px solid ${theme.bg.border};

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
  color: ${theme.text.alt};
  background: ${theme.bg.wash};
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
  max-width: 342px;

  > label:nth-of-type(2) {
    position: absolute;
    bottom: -24px;
    left: 16px;
  }
`;

export const Location = styled(FlexRow)`
  font-weight: 500;
  color: ${theme.text.alt};
  font-size: 14px;
  margin-bottom: 8px;

  > div {
    color: ${theme.text.placeholder};
  }

  > span {
    padding: 0 4px;
    color: ${theme.text.placeholder};
  }

  > a:hover {
    color: ${theme.brand.alt};
    text-decoration: underline;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const Loading = styled.span`
  display: inline-block;
  position: absolute;
  right: 19px;
  top: 45px;
`;

export const GithubSignin = styled.div``;
