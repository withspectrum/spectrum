// @flow
import styled from 'styled-components';

export const ContentContainer = styled.div`
  padding: 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 768px;
`;

export const PageTitle = styled.h1`
  font-size: 54px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  line-height: 1.2;
  margin: 48px 0 24px;
`;

export const PageSubtitle = styled.h2`
  font-size: 28px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;

  strong {
    font-weight: 500;
    color: ${props => props.theme.text.default};
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 64px 0 0;
`;

export const Subsection = styled.div`
  & + & {
    margin-top: 32px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  line-height: 1.3;
  margin-bottom: 16px;
`;

export const SectionSubtitle = styled.h4`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;
  margin: 16px 0;
`;

export const SectionDescription = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;

  & + & {
    margin-top: 16px;
  }
`;
