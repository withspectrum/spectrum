// @flow
import styled from 'styled-components';

export const EmailForm = styled.form`
  display: flex;
  align-items: flex-end;

  button {
    align-self: flex-end;
    margin-left: 16px;
  }
`;

export const SourceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  padding: 12px 0;

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const SourceContentContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-right: 12px;
  }
`;

export const SourceText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
export const SourceName = styled.p`
  line-height: 1.3;
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  display: flex;
  align-items: center;
`;
export const SourceExpiration = styled.p`
  line-height: 1.3;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
`;

export const AddCardSection = styled.section`
  background: ${props => props.theme.bg.wash};
  border-top: 1px solid ${props => props.theme.bg.border};
  width: calc(100% + 32px);
  padding: 16px;
  margin-top: 16px;
  margin-bottom: -16px;
  margin-left: -16px;
  margin-right: -16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0 0;
`;

export const LineItemTotal = styled(LineItem)`
  padding: 16px 0 0;
  margin-top: 16px;
  border-top: 1px solid ${props => props.theme.bg.border};
`;

export const LineItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const LineItemRight = styled.div`
  justify-content: flex-end;
  text-align: right;
  align-items: flex-start;
`;

export const LineItemTitle = styled.p`
  line-height: 1.6;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  display: flex;
  align-items: center;
`;

export const LineItemDescription = styled.p`
  line-height: 1.6;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};

  cursor: ${props => (props.link ? 'pointer' : 'auto')};

  &:hover {
    color: ${props =>
      props.warn ? props.theme.warn.default : props.theme.text.alt};
  }

  a {
    display: block;
    color: ${props => props.theme.brand.alt};
    margin-top: 4px;
  }
`;

export const LineItemTitleTotal = styled.p`
  line-height: 1.6;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-top: 8px;
`;
export const LineItemPrice = styled.p`
  line-height: 1.6;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
`;
