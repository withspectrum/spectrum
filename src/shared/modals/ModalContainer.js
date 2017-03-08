import React from 'react';
import { Wrapper, Header, Title, Body, Footer } from './styles';

const ModalContainer = props => {
  return (
    <Wrapper>
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
