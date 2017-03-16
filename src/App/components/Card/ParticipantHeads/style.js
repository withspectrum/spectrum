import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 12px;
`;

export const Head = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #fff, 0 1px 2px rgba(0,0,0,0.2);

  & + img {
    position: relative;
    left: -3px;
  }
`;
export const Label = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
  position: relative;
  top: -4px;
  margin-left: 4px;
  font-weight: 500;
`;
