//@flow
import React from 'react';
import {
  Wrapper,
  Col,
  Row,
  Heading,
  Meta,
  Description,
  ActionContainer,
} from './style';

type CardProps = {
  contents: {
    name: string,
    description?: string,
  },
  children?: React$Element<any>,
  meta?: string,
};

export const ListCardItem = (props: CardProps): React$Element<any> => {
  return (
    <Wrapper>
      <Row>
        <Col>
          <Heading>{props.contents.name}</Heading>
          <Meta>{props.meta}</Meta>
        </Col>
        <ActionContainer>{props.children}</ActionContainer>
      </Row>
      {!!props.contents.description && props.withDescription
        ? <Description>{props.contents.description}</Description>
        : ''}
    </Wrapper>
  );
};
