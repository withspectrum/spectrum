import styled from 'styled-components';
import { FlexCol } from '../../components/globals';

export const View = styled(FlexCol)`
  width: 100%;
  height: 100%;
`;

export const SectionHeader = styled.h1`
  font-size: 24px;
  font-weight: 800;
  padding: 32px 16px 16px;
  background: ${props => props.theme.bg.default};
  color: ${props => props.theme.text.default};
`;

export const SectionCard = styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: none;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const StyledThreadListItem = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  padding: 16px 0;
  flex-direction: column;

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
  }
`;
export const ThreadListItemTitle = styled.h4`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  line-height: 1.28;
  font-weight: 500;

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

export const Filter = styled.ul`
  margin: 16px 0;
  padding: 0;
  display: flex;
  list-style-type: none;
`;

export const FilterOption = styled.li`
  font-size: 16px;
  font-weight: ${props => (props.active ? '500' : '400')};
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  background: ${props =>
    props.active ? props.theme.brand.alt : props.theme.bg.wash};
  border: 1px solid
    ${props => (props.active ? props.theme.brand.alt : props.theme.bg.border)};
  display: flex;
  padding: 4px 16px;
  cursor: pointer;

  &:first-of-type {
    border-radius: 4px 0 0 4px;
    border-right: none;
  }

  &:last-of-type {
    border-radius: 0 4px 4px 0;
    border-left: none;
  }
`;
