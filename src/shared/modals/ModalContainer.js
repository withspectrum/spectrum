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
            reverse={props.user}
            subtle={!props.user}
            color={props.user ? 'text.reverse' : 'warn.alt'}
          />
        </CloseButton>}

      {props.user
        ? <UserHeader>
            <Cover />
            <UserPhoto src={props.user.photoURL} />
            <DisplayName>{props.user.displayName}</DisplayName>
            <Username>@{props.user.username}</Username>

            {props.user.subscriptions && <ProBadge>PRO</ProBadge>}
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
