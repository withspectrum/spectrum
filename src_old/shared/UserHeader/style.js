import styled from 'styled-components';

// TODO: Fix svg url so that masks work. (old: clip-path: ${props => props.size === 'small' ? 'url(#avatar-32)' : 'url(#avatar-48)' };)
export const Avatar = styled.img`
  height: ${props => (props.size === 'small' ? '32px' : '40px')};
  width: ${props => (props.size === 'small' ? '32px' : '40x')}
  border-radius: 4px;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export const Name = styled.h3`
  font-size: 14px;
  color: #43484F;
  font-weight: 600;
`;

export const Meta = styled.h4`
  font-size: 12px;
  color: #747E8D;
  font-weight: 400;
`;
