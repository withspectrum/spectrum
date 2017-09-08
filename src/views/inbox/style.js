import styled from 'styled-components';

export const View = styled.div`
  display: flex;
  flex-direction: row;
  align-self: stretch;
  align-items: stretch;
  overflow: hidden;
`;

export const List = styled.div`
  display: flex;
  flex: 0 0 320px;
  justify-content: flex-start;
  flex-direction: column;
  border-right: 2px solid ${props => props.theme.border.default};
  overflow-y: scroll;

  > a {
    border-bottom: 2px solid ${props => props.theme.border.default};
  }

  > a:last-of-type {
    border-bottom: none;
  }
`;

export const ThreadListItem = styled.div`
  display: flex;
  align-items: flex-start;
  flex: none;
  padding: 18px 16px 16px;
  background-color: ${props =>
    props.selected ? props.theme.bg.wash : props.theme.bg.default};
  cursor: pointer;

  p {
    color: ${props =>
      props.selected ? props.theme.text.default : props.theme.text.alt};
  }
`;

export const ThreadDetails = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 16px;
`;

export const Title = styled.h4`
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
`;

export const Preview = styled.p`
  display: flex;
  line-height: 1.4;
  font-weight: 400;
  font-size: 14px;
  margin-top: 2px;
  flex: none;
`;
