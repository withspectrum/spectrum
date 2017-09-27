// @flow
// $FlowFixMe
import styled from 'styled-components';

export const View = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SectionsContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-wrap: wrap;
  padding: 8px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  flex: 1 0 33%;

  @media (max-width: 768px) {
    flex: 1 0 100%;
    padding-top: 0;
    padding-bottom: 0;

    &:first-of-type {
      padding-top: 8px;
    }
  }
`;

export const SectionCard = styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  margin-bottom: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const SectionSubtitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const GrowthText = styled.h5`
  color: ${props =>
    props.positive
      ? props.theme.success.default
      : props.negative ? props.theme.warn.alt : props.theme.text.alt};
  display: inline-block;
  margin-right: 6px;
  font-size: 14px;
`;

export const Heading = styled.h1`
  margin-left: 16px;
  font-size: 32px;
  color: ${props => props.theme.text.default};
  font-weight: 800;
`;

export const Subheading = styled.h3`
  margin-left: 16px;
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  font-weight: 600;
  line-height: 1;
  margin-bottom: 8px;
`;

export const StyledHeader = styled.div`
  display: flex;
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  width: 100%;
  align-items: center;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const StyledThreadListItem = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  padding: 16px 0;
  flex-direction: column;

  &:last-of-type {
    border-bottom: 0;
  }
`;
export const ThreadListItemTitle = styled.h4`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  line-height: 1.28;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const ThreadListItemSubtitle = styled.h5`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  line-height: 1.28;
  margin-top: 4px;

  a:hover {
    color: ${props => props.theme.text.default};
  }
`;
