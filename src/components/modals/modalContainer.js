// @flow
import React from 'react';
import Icon from '../icons';
import { ModalBody, ModalContent, Title, Footer, CloseButton } from './styles';

/*
  ModalContainer is included around all modal components in order to have a
  consistent wrapper and consistent close-button behavior. Otherwise it will
  accept any arbitrary content via `props.children`
*/

const ModalContainer = ({ closeModal, children }): React$Element<any> => {
  return (
    <ModalBody>
      <CloseButton>
        <Icon icon="close" color={'text.alt'} hoverColor={'text.default'} />
      </CloseButton>

      <ModalContent>
        {children}
      </ModalContent>
    </ModalBody>
  );
};

export default ModalContainer;
