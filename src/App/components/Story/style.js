import styled from 'styled-components';

export const StoryWrapper = styled.div`
	display: inline-block;
	margin: 8px;
	margin-bottom: 0;
	flex: 0 0 auto;
	padding: 16px;
	border-radius: 2px;
	background-color: #ffffff;
	transition: box-shadow 0.2s ease-in;
	box-shadow: ${props => props.selected ? '0 2px 4px rgba(129, 148, 175, 0.2)' : '0 2px 8px rgba(73, 92, 240, 0.8)'};

	&:hover {
		box-shadow: 0 4px 16px rgba(129, 148, 175, 0.8);
		transition: box-shadow 0.2s ease-out;
		cursor: pointer;
	}
`;

export const StoryBody = styled.div`
	display: inline-block;
	margin-top: 16px;
	font-size: 14px;
`;

export const Avatar = styled.img`
	display: inline-block;
  height: 40px;
  width: 40px;
	border-radius: 12px;
	box-shadow: 0 0 1px rgba(0,0,0,0.3);
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.p`
	font-size: 16px;
	font-weight: 500;
	line-height: 1.6;
	margin-bottom: 8px;
	color: #171a21;
`;

export const Desc = styled.p`
	font-size: 14px;
	font-weight: regular;
	margin-bottom: 8px;
`;

export const Media = styled.img`
	width: 100%;
	margin: 8px 8px 0 0;
	border-radius: 4px;
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  flex: 1 0 auto;
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

export const UpvoteWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-self: end;
	align-items: center;
	flex: 0 0 auto;
	padding: 4px 12px 8px 12px;
	height: 48px;
	border-radius: 4px;
	border: 2px solid transparent;
	background-color: #ffffff;
	transition: all 0.2s ease-out;

	&:hover {
		border: 2px solid #3818e5;
		border-radius: 8px;
		transition: all 0.2s ease-in;
		
		> div {
			color: #3818e5;
		}
	}
`;

export const UpvoteLabel = styled.div`
	flex: 1 0 auto;
	font-weight: 700;
	color: #747E8D;

	&:first-of-type {
		font-size: 10px;
	}
`;