import React from 'react';
import Icon from '../Icons';
import {
  Wrapper,
  Cover,
  UserHeader,
  UserPhoto,
  DisplayName,
  Username,
  ProBadge,
  Header,
  Title,
  Body,
  Footer,
  CloseButton,
} from './styles';

const ModalContainer = props => {
  return (
    <Wrapper>
      {props.closeModal &&
        <CloseButton onClick={props.closeModal}>
          <Icon
            icon="close"
            reverse={props.user ? true : false}
            subtle={!props.user ? true : false}
            color={props.user ? 'text.reverse' : 'warn.alt'}
          />
        </CloseButton>}

      {props.user
        ? <UserHeader>
            <Cover />
            <UserPhoto src={props.user.photoURL} />
            <DisplayName>
              {props.user.displayName}
              {' '}
              {props.user.subscriptions && <ProBadge>PRO</ProBadge>}
            </DisplayName>
            <Username>@{props.user.username}</Username>
          </UserHeader>
        : <Header>
            <Title>{props.title}</Title>
          </Header>}

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
