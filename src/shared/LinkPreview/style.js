import styled from 'styled-components';
import { Shadow, Transition } from '../Globals';

export const LinkPreviewContainer = styled.a`
  display: flex;
  flex-direction: ${props => props.size === 'large' ? 'row' : 'column'};
  align-items:  ${props => props.size === 'large' ? 'center' : 'flex-start'};
  border-radius: 4px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.border.default};
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  padding: ${props => props.padding ? 0 : '16px'};
  transition: ${Transition.reaction.off};

  &:hover {
    transition: ${Transition.reaction.on};
    border: 1px solid ${({ theme }) => theme.brand.default};
  }
`;

export const Close = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
`;

export const LinkPreviewImage = styled.div`
  border-radius: 4px 0 0 4px;
  overflow: hidden;
  min-width: ${props => props.size === 'large' ? '140px' : '100%'};
  min-height: ${props => props.size === 'large' ? '140px' : '140px'};
  background: #f6f78;
  background: ${props => `url("${props.image}") no-repeat center center`};
  background-size: cover;
  ${props =>
  props.size === 'large'
    ? `border-right: 1px solid ${props.theme.border.default}`
    : `border-bottom: 1px solid ${props.theme.border.default}`};
`;

export const LinkPreviewTextContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  overflow: hidden;
  flex-direction: column;
  justify-content: ${props => props.size === 'large' ? 'center' : 'flex-start'};
  padding: ${props => props.padding ? '16px' : 0};
`;

export const BaseMeta = styled.p`
  display: flex;
  flex: 1 1 auto;
  line-height: 1.3;
  margin: 2px 0;
`;

export const MetaTitle = styled(BaseMeta)`
  font-size: 16px;
  font-weight: 800;
  white-space: normal;
  color: ${({ theme }) => theme.text.default};
`;

export const MetaDescription = styled(BaseMeta)`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.text.alt};
`;

export const MetaUrl = styled(BaseMeta)`
  color: #9FA7B5;
  margin-top: 8px;
  font-size: 12px;
`;
