import styled, { css } from 'styled-components';
import { Shadow, H4, H5 } from '../../../shared/Globals';

export const Wrapper = styled.div`
	display: inline-block;
	width: calc(100% - 16px);
	margin: 4px 8px;
	margin-bottom: 0;
	flex: 0 0 auto;
	border-radius: 4px;
	overflow: hidden;
	background-color: ${({ theme }) => theme.bg.default};
	transition: all 0.2s ease-in;
	-webkit-font-smoothing: subpixel-antialiased;
	box-shadow: ${Shadow.low};

	${props => !props.static &&
css`
		&:hover {
			box-shadow: ${Shadow.high};
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
	padding: 16px;
	transition: all 0.2s ease-in;
	box-shadow: inset -4px 0 0 ${props =>
  props.selected ? props.theme.brand.default : '#fff'};

	&:hover {
		box-shadow: inset -4px 0 0 ${props =>
  props.selected ? props.theme.brand.default : '#fff'};
		transition: all 0.2s ease-in-out;
	}
`;

export const StoryBody = styled.div`
	display: inline-block;
	font-size: 16px;
	font-weight: 600;
	flex: 0 0 auto;
	max-width: 100%;
	word-wrap: break-word;
	margin-bottom: 8px;
`;

export const Avatar = styled.img`
	display: inline-block;
  height: 16px;
  width: 16px;
	border-radius: 4px;
	box-shadow: ${Shadow.border};
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

export const Title = styled.p`
	font-size: 16px;
	font-weight: 400;
	line-height: 24px;
	color: ${({ theme }) => theme.text.default};
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export const Name = styled(H5)`
  color: ${({ theme }) => theme.text.alt};
	margin-top: 4px;

	a:hover {
		color: ${({ theme }) => theme.brand.default};
	}
`;

export const Meta = styled(H5)`
  color: ${({ theme }) => theme.text.alt};
`;

export const MetaFreq = styled(Meta)`
  color: ${({ theme }) => theme.text.alt};
  font-weight: 600;
  transition: color 0.2s ease-out;
  display: block;
  width: 100%;
  background: #fff;
  padding: 8px 16px;
  border-radius: 0 0 2px 2px;
  border-top: 1px solid ${({ theme }) => theme.generic.default};

  &:hover {
  	color: ${({ theme }) => theme.brand.default}
  	transition: color 0.2s ease-in;
  }
`;

export const UnreadCount = styled.span`
	color: ${({ theme }) => theme.warn.default};
`;
