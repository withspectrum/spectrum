import styled from 'styled-components';

export const StyledHeader = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  background: ${props => props.wash ? props.theme.bg.wash : '#fff'};
  padding: 32px;
  padding-bottom: 0;
`;

export const PhotosContainer = styled.div`
  display: block;
  padding: 8px 0;
`;

export const Photo = styled.img`
  border-radius: 44px;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
`;

export const Names = styled.h2`
  display: block;
  font-weight: 800;
  font-size: 24px;
  color: ${({ theme }) => theme.text.default};
`;

export const Username = styled.h3`
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text.alt};
  margin: 0;
`;
