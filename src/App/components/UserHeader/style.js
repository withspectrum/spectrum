import styled from 'styled-components';

export const Avatar32 = styled.img`
  height: 32px;
  width: 32px;
  clip-path: url(#avatar-32);
`;

export const Avatar40 = styled.img`
    height: 40px;
    width: 40px;
    clip-path: url(#avatar-40);
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  margin-top: -2px;
`;

export const Name = styled.h3`
  font-size: 14px;
  color: #43484F;
  font-weight: 600;
`;

export const PostMeta = styled.h4`
  font-size: 12px;
  color: #747E8D;
  font-weight: 400;
`;