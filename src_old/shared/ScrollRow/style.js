import styled from 'styled-components';
import { FlexRow } from '../Globals';

export const ScrollableFlexRow = styled(FlexRow)`
	overflow-x: scroll;
	flex-wrap: nowrap;
	background: transparent;
	cursor: pointer;
	cursor: hand;
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
`;
