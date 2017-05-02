import styled from 'styled-components';
import { Shadow, H4, H5, FlexRow } from '../../../shared/Globals';

export const Wrapper = styled.div`
  display: inline-block;
  width: calc(100% - 16px);
  margin: 8px 8px 0 8px;
  flex: 0 0 auto;
  border-radius: 4px;
  overflow: ${props => (props.overflow === 'visible' ? 'visible' : 'hidden')};
  background-color: ${({ theme }) => theme.bg.default};
  transition: all 0.2s ease-in;
  -webkit-font-smoothing: subpixel-antialiased;
  box-shadow: ${Shadow.low};

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    margin-bottom: 4px;
    border-radius: 0;

    &:first-of-type {
      margin-top: 8px;
    }
  }
`;

export const Heading = styled(H4)`
  font-weight: 400;
  color: ${props => props.theme.text.default};
`;

export const Title = styled.b`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const Subheading = styled(H5)`
  color: ${props => props.theme.text.alt};
`;

export const CardHeader = styled(FlexRow)`

`;

export const MessageCount = styled(H5)`
  color: ${props => props.theme.text.alt};
  padding-top: 4px;
`;
