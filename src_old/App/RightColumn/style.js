import styled from 'styled-components';
import { Shadow, FlexRow } from '../../shared/Globals';

export const ViewContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
	height: 100%;
	overflow-y: hidden;
	flex-direction: column;
	position: relative;
	z-index: 3;
	background: #fff;
	overflow-x: hidden;

	@media (max-width: 768px) {
		overflow-y: auto;
	}
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	align-items: center;
	padding: 0;
	margin: 0;
	background-color: ${({ theme }) => theme.bg.default};

	@media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

export const LoginWrapper = styled(FlexRow)`
	width: calc(100% - 16px);
	margin: 0 8px;
	border-top: 2px solid ${props => props.theme.border.default};
	height: 64px;
	align-self: center;
	justify-content: center;

	> h4 {
		margin-right: 16px;
	}
`;

export const SubText = styled.h5`
	font-size: 12px;
	font-weight: 500;
	color: ${({ theme }) => theme.text.alt};
`;

export const Name = styled.h3`
	font-weight: 800;
	font-size: 16px;
	position: relative;
	text-transform: capitalize;
	margin-top: -8px;
`;

export const Heading = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	flex: 1;
`;

export const Spacer = styled.div`
	width: 48px;
`;

export const BackArrow = styled.span`
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
	background: #fff;
	box-shadow: ${Shadow.low};
	height: 48px;
	align-items: center;
	display: none;
	padding-left: 8px;

	@media (max-width: 768px) {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}
`;
