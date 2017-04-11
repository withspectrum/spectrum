import React from 'react';
import { connect } from 'react-redux';
import UpgradeModal from './UpgradeModal/index';
import FrequencyCreationModal from './FrequencyCreationModal/index';
import FrequencyEditModal from './FrequencyEditModal/index';
import EditAccountModal from './EditAccountModal/index';
import UserProfileModal from './UserProfileModal/index';

const MODAL_COMPONENTS = {
  UPGRADE_MODAL: UpgradeModal,
  FREQUENCY_CREATION_MODAL: FrequencyCreationModal,
  FREQUENCY_EDIT_MODAL: FrequencyEditModal,
  EDIT_ACCOUNT_MODAL: EditAccountModal,
  USER_PROFILE_MODAL: UserProfileModal,
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
