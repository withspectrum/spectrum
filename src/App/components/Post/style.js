import styled from 'styled-components';

export const PostWrapper = styled.div`
	display: inline-block;
	margin: 8px;
	padding: 16px;
	border-radius: 2px;
	background-color: #ffffff;
	box-shadow: 0 2px 4px rgba(129, 148, 175, 0.5);
	transition: box-shadow 0.2s ease-in;

	&:hover {
		box-shadow: 0 4px 16px rgba(129, 148, 175, 0.8);
		transition: box-shadow 0.2s ease-out;
	}
`;

export const PostBody = styled.div`
	display: inline-block;
	margin-top: 16px;
	font-size: 14px;
`;

export const PostImg = styled.img`
	max-width: calc(100% - 0px);
	margin-top: 16px;
	border-radius: 2px;
`;

export const Avatar = styled.img`
  height: 40px;
  width: 40px;
  clip-path: url(#avatar-40);
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
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
	justify-self: end;
	flex: 0 0 auto;
`;

export const UpvoteButton = styled.div`
	justify-self: start;
	font-weight: 700;
`;