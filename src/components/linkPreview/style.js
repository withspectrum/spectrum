import styled, { keyframes } from 'styled-components';
import { Transition } from '../globals';

export const LinkPreviewContainer = styled.a`
  display: flex;
  flex-direction: ${props => (props.size === 'large' ? 'row' : 'column')};
  align-items:  ${props => (props.size === 'large' ? 'center' : 'flex-start')};
  border-radius: 4px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.border.default};
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  padding: ${props => (props.padding ? 0 : '16px')};
  transition: ${Transition.reaction.off};
  max-height: ${props => (props.size === 'large' ? '140px' : '100%')};
  margin: ${props => (props.margin ? props.margin : '16px')};
  flex: 1;

  &:hover {
    transition: ${Transition.reaction.on};
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    border: 1px solid ${({ theme }) => '#cfd7e0'};
  }
`;

export const Close = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
`;

export const LinkPreviewImage = styled.div`
  overflow: hidden;
  min-width: ${props => (props.size === 'large' ? '140px' : '100%')};
  min-height: ${props => (props.size === 'large' ? '140px' : '140px')};
  background: #f6f78;
  background: ${props => `url("${props.image}") no-repeat center center`};
  background-size: cover;
  ${props => (props.size === 'large' ? `border-right: 1px solid ${props.theme.border.default}` : `border-bottom: 1px solid ${props.theme.border.default}`)};
`;

export const LinkPreviewTextContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  overflow: hidden;
  flex-direction: column;
  justify-content: ${props => (props.size === 'large' ? 'center' : 'flex-start')};
  padding: ${props => (props.padding ? '8px 12px' : 0)};
  max-width: 100%;
`;

export const BaseMeta = styled.p`
  display: flex;
  flex: 1 1 auto;
  line-height: 1.2;
  margin: 2px 0;
  width: calc(100% - 16px);
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaTitle = styled(BaseMeta)`
  font-size: 15px;
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
  font-weight: 500;
  margin-top: 8px;
  font-size: 12px;
`;

export const LinkPreviewSkeleton = styled.div`
	display: flex;
	flex-direction: row;
	align-items:  center;
	border-radius: 4px;
	background: #fff;
	border: 1px solid ${({ theme }) => theme.border.default};
	box-shadow: 0 1px 2px rgba(0,0,0,0.08);
	overflow: hidden;
	position: relative;
	height: 140px;
	z-index: 2;
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
	animation-duration: 2s;
	animation-fill-mode: forwards;
	animation-iteration-count: infinite;
	animation-name: ${placeHolderShimmer};
	animation-timing-function: linear;
	background: #f6f7f8;
	background: linear-gradient(to right, #f6f7f8 8%, #F0F1F3 18%, #f6f7f8 33%);
	background-size: 100% 140px;
	position: relative;
	z-index: 3;
`;

const Cover = styled.div`
	position: absolute;
	background: #fff;
	z-index: 4;
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
