import styled from 'styled-components';
import { Palette, Shadow, H4, H5 } from '../../../shared/Globals'

export const StoryWrapper = styled.div`
	display: inline-block;
	width: calc(100% - 16px);
	margin: 8px;
	margin-bottom: 0;
	flex: 0 0 auto;
	padding: 16px;
	border-radius: 2px;
	background-color: ${Palette.bg.default};
	transition: all 0.2s ease-in;
	-webkit-font-smoothing: subpixel-antialiased;
	z-index: 1;
	transform: translateZ(0) scale( ${props => props.selected ? `1` : `0.975`} );
	box-shadow: ${props => props.selected ? `0 2px 16px -4px ${Palette.brand.default}` : `${Shadow.low}` };

	&:hover {
		box-shadow: ${props => props.selected ? `0 4px 32px -8px ${Palette.brand.default}` : `${Shadow.high}` };
		transition: box-shadow 0.2s ease-out;
		cursor: pointer;
		z-index: 1;
		transform: translateZ(0) scale( ${props => props.selected ? `1` : `0.975`} );
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
	box-shadow: ${Shadow.border};
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.p`
	font-size: 16px;
	font-weight: 600;
	line-height: 1.5;
	margin-bottom: 8px;
	color: ${Palette.text.default};
`;

export const Media = styled.img`
	width: 100%;
	max-height: 240px;
	object-fit: cover;
	background-color: ${Palette.inactive};
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
  color: ${Palette.text.default};
  font-weight: 700;
`;

export const Meta = styled(H5)`
  color: ${Palette.text.alt};
`;