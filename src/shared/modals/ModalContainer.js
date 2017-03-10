import React from 'react';
import { Wrapper, Header, Title, Body, Footer, CloseButton } from './styles';

const ModalContainer = props => {
  return (
    <Wrapper>
      {props.closeModal &&
        <CloseButton onClick={props.closeModal}>✖</CloseButton>}
      <Header>
        <Title>{props.title}</Title>
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
