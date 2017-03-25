import styled, { keyframes } from 'styled-components';
import { isMobile } from '../../../helpers/utils';

const maxWidth = '440px';
const mobile = isMobile();
export const modalStyles = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: mobile ? 'flex-start' : 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 200,
    padding: '1.2rem',
  },
  content: {
    position: 'relative',
    background: '#ffffff',
    backgroundClip: 'padding-box',
    borderRadius: '8px',
    border: '0',
    padding: '0',
    zIndex: 201,
    width: '100%',
    maxWidth: maxWidth,
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

export const Section = styled.section`
  width: ${props => props.width ? props.width : '100%'};
  text-align: ${props => props.centered ? 'center' : 'auto'};
  position: relative;

  @media all and (max-width: 600px) {
    width: 100%;
  }
`;

export const SectionAlert = styled(Section)`
  background: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%);
  color: #fff;
  line-height: 1.3;
  font-weight: 600;
  font-size: 0.875rem;
  text-shadow: 0 1px 1px rgba(0,0,0,0.1);
  border-radius: 4px;
  margin: 0 auto 0.5rem;

  @media all and (max-width: 600px) {
    margin-top: 0;
    border-radius: 0;
  }
`;

export const SectionError = styled(SectionAlert)`
  border-radius: 4px;
  margin-top: 1rem;
  background: radial-gradient(ellipse farthest-corner at top left , #ff7600 0%, #fa0202 100%);
  height: ${props => props.error ? 'auto' : '0px'};
  overflow: ${props => props.error ? 'visible' : 'hidden'};
  transition: all 0.2s ease-out;
  margin-bottom: 0;
  position: relative;
  top: 1px;
`;

export const Padding = styled.span`
  display: inline-block;
  padding: ${props => props.padding};
`;

export const Heading = styled.h2`
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  color: rgba(23, 26, 33, 1);
  margin: 0.5rem 0;
`;

export const Subheading = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
  color: rgba(23, 26, 33, 0.8);
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};

  @media all and (max-width: 600px) {
    flex-direction: column;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  margin: 0 auto;
  opacity: ${props => props.loading ? '1' : '0'};
  height: ${props => props.size ? props.size + 'px' : '1rem'};
  width: ${props => props.size ? props.size + 'px' : '1rem'};
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0);
  border-top-color: ${props => props.color};
  animation: ${rotate} 1s infinite linear;
  position: absolute;
  top: 12px;
  left: 48%;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease-out;
`;

export const ButtonLabel = styled.span`
  opacity: ${props => props.loading ? '0' : '1'};
  transition: opacity 0.2s ease-out;
  width: 100%;
`;

export const Profile = styled.div`
  position: relative;
  padding-top: 16px;

  img {
    border-radius: 8px;
    width: 32px;
    height: 32px;
  }

  span {
    background: #00C384;
    background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%);
    position: absolute;
    left: 52%;
    top: 32px;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 4px;
    border-radius: 4px;
    line-height: 1.5;
  }
`;
