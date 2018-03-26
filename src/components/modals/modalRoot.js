// @flow
import React from 'react';
import { connect } from 'react-redux';
import CreateChannelModal from './CreateChannelModal';
import DeleteDoubleCheckModal from './DeleteDoubleCheckModal';
import UpgradeModal from './UpgradeModal';
import RepExplainerModal from './RepExplainerModal';
import ChangeChannelModal from './ChangeChannelModal';
import UpgradeAnalyticsModal from './UpgradeAnalyticsModal';
import UpgradeModeratorSeatModal from './UpgradeModeratorSeatModal';
import RestoreChannelModal from './RestoreChannelModal';
import ChatInputLoginModal from './ChatInputLoginModal';
import AdminEmailAddressVerificationModal from './AdminEmailAddressVerificationModal';

const MODAL_COMPONENTS = {
  CREATE_CHANNEL_MODAL: CreateChannelModal,
  DELETE_DOUBLE_CHECK_MODAL: DeleteDoubleCheckModal,
  UPGRADE_MODAL: UpgradeModal,
  REP_EXPLAINER_MODAL: RepExplainerModal,
  CHANGE_CHANNEL: ChangeChannelModal,
  UPGRADE_ANALYTICS_MODAL: UpgradeAnalyticsModal,
  UPGRADE_MODERATOR_SEAT_MODAL: UpgradeModeratorSeatModal,
  RESTORE_CHANNEL_MODAL: RestoreChannelModal,
  CHAT_INPUT_LOGIN_MODAL: ChatInputLoginModal,
  ADMIN_EMAIL_ADDRESS_VERIFICATION_MODAL: AdminEmailAddressVerificationModal,
};

/*
  Takes a modalType and modalProps to dynamically return the
  modal component we imported above
*/
const modalRoot = ({ modalType, modalProps }) => {
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

// $FlowIssue
export default connect(mapStateToProps)(modalRoot);
