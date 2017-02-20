import React from 'react';
import { connect } from 'react-redux';
import ProModal from './ProModal/index';
import FrequencyCreationModal from './FrequencyCreationModal/index';

const MODAL_COMPONENTS = {
  PRO_MODAL: ProModal,
  FREQUENCY_CREATION_MODAL: FrequencyCreationModal
};

const ModalRoot = ({ modalType, modalProps }) => {
  if (!modalType) {
    return <span />; // after React v15 you can return null here
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
};

const mapStateToProps = state => ({
  modalProps: state.modals.modalProps,
  modalType: state.modals.modalType,
});

export default connect(mapStateToProps)(ModalRoot);
