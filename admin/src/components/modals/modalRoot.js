// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import DeleteDoubleCheckModal from './DeleteDoubleCheckModal';

const MODAL_COMPONENTS = {
  DELETE_DOUBLE_CHECK_MODAL: DeleteDoubleCheckModal,
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
