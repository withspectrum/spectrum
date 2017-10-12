import styled, { keyframes } from 'styled-components';
import { Transition, Shadow, hexa, zIndex } from '../globals';

export const LinkPreviewContainer = styled.a`
  display: flex;
  flex-direction: ${props => (props.size === 'large' ? 'row' : 'row')};
  align-items: ${props => (props.size === 'large' ? 'flex-start' : 'center')};
  border-radius: 4px;
  background: ${props => props.theme.bg.default};
  border: 1px solid ${({ theme }) => theme.bg.border};
  ${'' /* box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.1)}; */} overflow: hidden;
  position: relative;
  margin: ${props => (props.margin ? props.margin : '0')};
  padding: 0;
  transition: ${Transition.reaction.off};
  flex: auto;
  pointer-events: auto;

  &:hover {
    transition: ${Transition.reaction.on};
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.1)};
    border: 1px solid ${({ theme }) => theme.bg.border};
  }
`;

export const Close = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
`;

export const LinkPreviewImage = styled.div`
  overflow: hidden;
  min-width: ${props => (props.size === 'large' ? '100%' : '64px')};
  min-height: 64px;
  background: ${props =>
    `${props.theme.bg.wash} url("${props.image}") no-repeat center center`};
  background-size: cover;
`;

export const LinkPreviewTextContainer = styled.div`
  display: flex;
  flex: auto;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 12px;
  align-self: stretch;
`;

export const BaseMeta = styled.span`
  display: flex;
  flex: none;
  line-height: 1.2;
  margin: 2px 0;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: stretch;
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
  color: ${({ theme }) => theme.text.placeholder};
  font-weight: 500;
  margin-top: 8px;
  font-size: 12px;
`;

export const LinkPreviewSkeleton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.bg.border};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.1)};
  overflow: hidden;
  position: relative;
  height: 140px;
  z-index: ${zIndex.loading};
  margin: ${props => (props.margin ? props.margin : '16px')};
`;

const placeHolderShimmer = keyframes`
	0%{
			background-position: -600px 0
	}
	100%{
			background-position: 600px 0
	}
`;

export const AnimatedBackground = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: ${zIndex.loading + 2};
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.bg.wash} 10%,
    ${({ theme }) => hexa(theme.generic.default, 0.65)} 20%,
    ${({ theme }) => theme.bg.wash} 30%
  );
  animation-name: ${placeHolderShimmer};
  z-index: ${zIndex.loading + 1};
`;

const Cover = styled.div`
  position: absolute;
  background: ${props => props.theme.bg.default};
  z-index: ${zIndex.loading + 2};
`;

export const CoverLeft = styled(Cover)`
  left: 140px;
  width: 24px;
  height: 100%;
`;

export const CoverTop = styled(Cover)`
  right: 0;
  top: 0;
  height: 40px;
  width: calc(100% - 152px);
`;

export const CoverMiddle = styled(Cover)`
  right: 0;
  top: 52px;
  height: 16px;
  width: calc(100% - 152px);
`;

export const CoverMiddleMiddle = styled(Cover)`
  right: 0;
  top: 80px;
  height: 20px;
  width: calc(100% - 152px);
`;

export const CoverMiddleTopRight = styled(Cover)`
  right: 0;
  top: 34px;
  height: 20px;
  width: calc(100% - 482px);
`;

export const CoverMiddleBottomRight = styled(Cover)`
  right: 0;
  top: 64px;
  height: 20px;
  width: calc(100% - 342px);
`;

export const CoverMiddleMiddleBottomRight = styled(Cover)`
  right: 0;
  top: 88px;
  height: 20px;
  width: calc(100% - 382px);
`;

export const CoverBottom = styled(Cover)`
  right: 0;
  bottom: 0;
  height: 30px;
  width: calc(100% - 152px);
`;
