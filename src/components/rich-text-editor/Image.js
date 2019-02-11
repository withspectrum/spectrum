// @flow
import theme from 'shared/theme';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const blinkBorder = keyframes`
  0% {
    border-color: transparent;
  }
  49% {
    border-color: transparent;
  }
  50% {
    border-color: black;
  }
  100% {
    border-color: black;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  margin: 12px 0;
  pointer-events: none;
`;

const Img = styled.img`
  ${props =>
    props.active &&
    css`
      /* Pretend like there's a cursor next to the image when active */
      box-shadow: inset -1px 0 0 #000;
      animation: ${blinkBorder} 1s infinite;
    `} max-width: 100%;
`;

type ImageProps = Object;

const Image = (props: ImageProps) => {
  const {
    block, // eslint-disable-line no-unused-vars
    theme, // eslint-disable-line no-unused-vars
    blockProps, // eslint-disable-line no-unused-vars
    customStyleMap, // eslint-disable-line no-unused-vars
    customStyleFn, // eslint-disable-line no-unused-vars
    decorator, // eslint-disable-line no-unused-vars
    forceSelection, // eslint-disable-line no-unused-vars
    offsetKey, // eslint-disable-line no-unused-vars
    selection, // eslint-disable-line no-unused-vars
    tree, // eslint-disable-line no-unused-vars
    contentState, // eslint-disable-line no-unused-vars
    ...elementProps
  } = props;
  const active = props.blockProps.isFocused;
  const { src, alt } = contentState.getEntity(block.getEntityAt(0)).getData();
  return (
    <ImageContainer>
      <Img src={src} alt={alt} active={active} {...elementProps} />
    </ImageContainer>
  );
};

export default Image;
