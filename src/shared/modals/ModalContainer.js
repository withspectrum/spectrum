import React from 'react';
import { Wrapper, Header, Title, Body, Footer, Close } from './styles';

const ModalContainer = props => {
  return (
    <Wrapper>
      <Header>
        <Title>{props.title}</Title>

        <Close onClick={props.hideModal}>
          ✕
        </Close>
      </Header>

      <Body>
        {props.children}
      </Body>

      <Footer>
        {props.footer}
      </Footer>
    </Wrapper>
  );
};

export default ModalContainer;
