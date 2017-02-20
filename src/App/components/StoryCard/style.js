import styled, { css } from 'styled-components';
import { Shadow, H4, H5 } from '../../../shared/Globals';

export const Card = styled.div`
	display: inline-block;
	width: calc(100% - 16px);
	margin: 8px;
	margin-bottom: 0;
	flex: 0 0 auto;
	padding: 16px;
	border-radius: 2px;
	background-color: ${({ theme }) => theme.bg.default};
	transition: all 0.2s ease-in;
	-webkit-font-smoothing: subpixel-antialiased;
	box-shadow: ${Shadow.low}, inset ${props =>
  props.selected
    ? `-16px 0 0 -8px ${props.theme.brand.default}`
    : `0px 0 0 0px transparent`};

	${props => !props.static &&
css`
		&:hover {
			box-shadow: ${Shadow.high} ${props.selected
	    ? `, inset -32px 0 0 -16px ${props.theme.brand.default}`
	    : ``};
			transition: all 0.2s ease-out;
			cursor: pointer;
		}
	`}
`;

export const LinkWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 0 0 auto;
	background-color: #ffffff;
`;

export const StoryBody = styled.div`
	display: inline-block;
	margin-top: 16px;
	font-size: 14px;
	flex: 0 0 auto;
`;

export const Avatar = styled.img`
	display: inline-block;
  height: 40px;
  width: 40px;
	border-radius: 12px;
	box-shadow: ${Shadow.border};
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

export const Title = styled.p`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${({ theme }) => theme.text.default};
	margin-bottom: 8px;
`;

export const Media = styled.img`
	width: 100%;
	max-height: 240px;
	object-fit: cover;
	background-color: ${({ theme }) => theme.inactive};
	margin: 8px 8px 0 0;
	border-radius: 4px;
	box-shadow: ${Shadow.border};
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1 0 auto;
`;

export const Name = styled(H4)`
  color: ${({ theme }) => theme.text.default};
  font-weight: 700;
`;

export const Meta = styled(H5)`
  color: ${({ theme }) => theme.text.alt};
`;

export const MetaFreq = styled(Meta)`
  color: ${({ theme }) => theme.text.placeholder};
  font-weight: 700;
  transition: color 0.2s ease-out;

  &:hover {
  	color: ${({ theme }) => theme.brand.default}
  	transition: color 0.2s ease-in;
  }
`;
