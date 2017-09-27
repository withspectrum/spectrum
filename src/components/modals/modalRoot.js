import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import UserProfileModal from './UserProfileModal';
import CreateChannelModal from './CreateChannelModal';
import DeleteDoubleCheckModal from './DeleteDoubleCheckModal';
import UpgradeModal from './UpgradeModal';
import CommunityUpgradeModal from './CommunityUpgradeModal';

const MODAL_COMPONENTS = {
  USER_PROFILE_MODAL: UserProfileModal,
  CREATE_CHANNEL_MODAL: CreateChannelModal,
  DELETE_DOUBLE_CHECK_MODAL: DeleteDoubleCheckModal,
  UPGRADE_MODAL: UpgradeModal,
  COMMUNITY_UPGRADE_MODAL: CommunityUpgradeModal,
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

export default connect(mapStateToProps)(modalRoot);
