import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

export const OverviewRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.border.default};
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: ${props => props.theme.text.default};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Subsection = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 0;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex: 1 0 100%;
  }
`;

export const Subtext = styled.h3`
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  color: ${props => props.theme.text.alt};
`;

export const Count = styled.h4`
  font-size: 24px;
  font-weight: 800;
`;

export const HeaderZoneBoy = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.border.default};
  align-items: center;
  padding: 32px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const RangePicker = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    margin-top: 16px;
    width: 100%;
  }
`;

export const RangeItem = styled.li`
  display: inline-block;
  padding: 8px 24px;
  margin: 8px 0;
  background: ${props =>
    props.active ? props.theme.brand.default : props.theme.bg.wash};
  color: ${props => (props.active ? '#fff' : props.theme.text.default)};
  box-shadow: inset -1px 0 ${props => props.theme.border.default};
  font-size: 14px;
  font-weight: ${props => (props.active ? 600 : 500)};
  text-align: center;

  &:hover {
    background: ${props =>
      props.active ? props.theme.brand.default : props.theme.border.default};
    cursor: pointer;
  }

  &:first-of-type {
    border-radius: 8px 0 0 8px;
  }

  &:last-of-type {
    border-radius: 0 8px 8px 0;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    width: 33%;
  }
`;
