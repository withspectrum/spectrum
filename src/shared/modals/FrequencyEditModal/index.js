import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { closeModal } from '../../../actions/modals';
import { editFrequency, deleteFrequency } from '../../../actions/frequencies';
import { connect } from 'react-redux';
import {
  modalStyles,
  Footer,
  NameLabel,
  NameInput,
  ErrorMessage,
  Privacy,
  PrivacyLabel,
  PrivacyCheckbox,
  PrivacyText,
  SaveButton,
  DeleteButton,
  BigDeleteButton,
  DeleteWarning,
  EditDescription,
  EditDescriptionInput,
} from './style';

class FrequencyEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      name: props.name,
      description: props.description || '',
      error: '',
      exists: false,
      private: props.settings.private,
      loading: false,
      disabled: true,
      deleteAttempted: false,
      deleteText: 'Confirm Delete',
    };
  }

  toggleDeleteAttempt = () => {
    this.setState({
      deleteAttempted: !this.state.deleteAttempted,
    });
  };

  handleChange = e => {
    let name = ReactDOM.findDOMNode(this.refs.name).value;
    let lowercaseName = name.toLowerCase().trim();
    name.trim();

    if (
      lowercaseName === 'everything' ||
      lowercaseName === 'null' ||
      lowercaseName === 'undefined'
    ) {
      this.setState({
        error: "'Everything', 'null', and 'undefined' can't be used as a frequency name, but nice try!",
      });

      return;
    }

    if (name.length > 20) {
      this.setState({
        error: 'Frequency names can only be 20 characters long.',
      });

      return;
    }

    this.setState({
      name: e.target.value,
      error: '',
      disabled: false,
    });
  };

  togglePrivacy = e => {
    this.setState({
      private: !this.state.private,
      disabled: false,
    });
  };

  closeModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
    // setTimeout(() => { this.props.dispatch(closeModal()) }, 300)
    this.props.dispatch(closeModal());
  };

  editDescription = e => {
    if (e.target.value.length > 140) {
      this.setState({
        error: 'Frequency descriptions can only be up to 140 characters long.',
      });

      return;
    }

    this.setState({
      description: e.target.value,
      error: '',
      disabled: false,
    });
  };

  prepareEditedFrequency = () => {
    // just in case a user tries to modify the html
    if (
      this.state.error ||
      this.state.loading ||
      this.state.exists ||
      !this.state.name ||
      !this.state.description
    ) {
      return;
    }

    let frequencyObj = {
      id: this.props.id,
      name: this.state.name.toString(),
      slug: this.props.slug.toString(),
      description: this.state.description.toString(),
      settings: {
        private: this.state.private,
        tint: this.props.settings.tint,
      },
    };

    this.props.dispatch(editFrequency(frequencyObj));
  };

  deleteFrequency = () => {
    let id = this.props.id;
    this.setState({
      deleteText: 'Deleting...',
    });

    this.props.dispatch(deleteFrequency(id));
  };

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        contentLabel="Edit Frequency"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >

        <ModalContainer title={'Edit Frequency'} closeModal={this.closeModal}>
          <NameLabel>
            Change Name
            <NameInput
              ref="name"
              type="text"
              defaultValue={this.state.name}
              placeholder="Frequency Name..."
              onChange={this.handleChange}
            />
          </NameLabel>

          {this.state.exists &&
            <ErrorMessage>
              Oops, a frequency with this name already exists.
            </ErrorMessage>}

          <EditDescription>
            <EditDescriptionInput
              ref="customDescription"
              type="text"
              placeholder={this.state.description}
              defaultValue={this.state.description}
              onChange={this.editDescription}
            />
          </EditDescription>

          {this.state.error && <ErrorMessage>{this.state.error}</ErrorMessage>}

          <Privacy>
            <PrivacyLabel>
              <PrivacyCheckbox
                type="checkbox"
                checked={this.state.private}
                onChange={this.togglePrivacy}
              />
              Private
            </PrivacyLabel>

            <PrivacyText>
              Only members will be able to see stories posted in this frequency. You will be able to approve and block specific people from this frequency.
            </PrivacyText>

            <PrivacyText>
              People will be able to request approval at{' '}
              <b>https://spectrum.chat/~{this.props.slug}</b>
            </PrivacyText>
            <br />
          </Privacy>

          {this.state.deleteAttempted &&
            <DeleteWarning>
              Heads up: once you delete this frequency there's no going back. All the stories, members, messages and settings will be gone. You sure?
            </DeleteWarning>}

          {this.state.deleteAttempted
            ? <Footer>
                <DeleteButton gray onClick={this.toggleDeleteAttempt}>
                  Cancel
                </DeleteButton>
                <BigDeleteButton onClick={this.deleteFrequency}>
                  {this.state.deleteText}
                </BigDeleteButton>
              </Footer>
            : <Footer>
                <DeleteButton onClick={this.toggleDeleteAttempt}>
                  Delete Frequency
                </DeleteButton>
                <SaveButton
                  onClick={this.prepareEditedFrequency}
                  disabled={
                    this.state.disabled ||
                      this.state.error ||
                      !this.state.name ||
                      this.state.exists ||
                      this.state.description.length === 0
                  }
                >
                  Save
                </SaveButton>
              </Footer>}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(FrequencyEditModal);
