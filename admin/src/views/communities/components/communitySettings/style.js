import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.bg.default};
  border-bottom: 1px solid ${props => props.theme.bg.border};
  padding: 16px;
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
  flex: 0 0 auto;

  &:hover {
    background: ${props => props.theme.bg.wash};
    cursor: pointer;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

export const Name = styled.h2`
  font-weight: 600;
  color: ${props => props.theme.text.default};
  font-size: 16px;
  margin: 0;
  line-height: 1.3;
`;

export const Username = styled.h3`
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  font-size: 14px;
  line-height: 1.2;
`;

export const EditForm = styled.div`
  border-radius: 4px;
  border-top: 1px solid ${props => props.theme.bg.border};
  padding: 16px 0;
  padding-bottom: 0;
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-top: 16px;
  margin-bottom: 8px;
  flex-direction: column;
  align-items: flex-start;
`;

export const List = styled.ul`
  list-style-type: none;
`;

export const Save = styled.span`
  align-self: flex-start;
  margin-top: 16px;
`;
