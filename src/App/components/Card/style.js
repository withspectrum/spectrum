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

	@media (max-width: 768px) {
		width: 100%;
		margin: 0;
		margin-bottom: 4px;
		border-radius: 0;
	}

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
	padding: 16px;
	padding-bottom: 8px;
`;

export const Avatar = styled.img`
	display: inline-block;
  height: 16px;
  width: 16px;
	border-radius: 50%;
	box-shadow: ${Shadow.border};
	margin-right: 8px;
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
	border-top: 1px solid #f6f7f8;
	padding: 8px 16px;
	background: #fff;
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
	max-width: 100%;
`;

export const Name = styled(H5)`
  color: ${({ theme }) => theme.text.alt};
	display: flex;
	align-items: center;

	a:hover {
		color: ${({ theme }) => theme.brand.default};
	}
`;

export const MessageCount = styled(Name)`
	margin-top: 4px;
`;

export const Meta = styled(H5)`
  color: ${({ theme }) => theme.text.alt};
	word-break: break-all;
`;

export const FrequencyLink = styled(H5)`
	display: inline;
	color: ${({ theme }) => theme.text.alt};
	max-width: 100%;
	word-break: break-all;
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
