import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { hideModal } from '../../../actions/modals';
import { editFrequency, deleteFrequency } from '../../../actions/frequencies';
import { checkUniqueFrequencyName, debounce } from '../../../helpers/utils';
import { connect } from 'react-redux';
import slugg from 'slugg';
import {
  modalStyles,
  Footer,
  EditSlug,
  EditSlugInput,
  Pre,
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
  DeleteWarning
} from './style'

class FrequencyEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      name: props.name,
      slug: props.slug,
      error: '',
      exists: false,
      editedSlug: false,
      private: props.settings.private,
      loading: false,
      disabled: true,
      deleteAttempted: false,
      deleteText: 'Confirm Delete'
    };

    this.editSlug = debounce(this.editSlug, 500) // query the server every 200ms instead of on every keystroke
  }

  toggleDeleteAttempt = () => {
    this.setState({
      deleteAttempted: !this.state.deleteAttempted
    })
  }

  handleChange = (e) => {
    let name = ReactDOM.findDOMNode(this.refs.name).value
    let lowercaseName = name.toLowerCase().trim()
    name.trim()

    if (lowercaseName === 'everything') {
      this.setState({
        error: "Everything can't be a frequency name, sorry!"
      })

      return
    }

    if (name.length > 20) {
      this.setState({
        error: "Frequency names can only be 20 characters long."
      })

      return
    }

    this.setState({
      name: e.target.value,
      error: '',
      disabled: false
    })
  }

  editSlug = () => {
    let customSlug = ReactDOM.findDOMNode(this.refs.customSlug).value
    customSlug.trim()
    let editedSlug = slugg(customSlug)

    this.setState({
      slug: editedSlug,
      editedSlug: true,
      loading: true,
      disabled: false
    })

    if (editedSlug === "everything") {
      this.setState({
        error: "~everything can't be used, sorry!"
      })

      return
    }

    if (editedSlug.length > 20) {
      this.setState({
        error: "Getting a bit carried away now, eh? It's best to use a shorter, more memorable URL (less than 20 characters)."
      })

      return
    }

    if (editedSlug === this.props.slug) {
      this.setState({
        editedSlug: false
      })

      return
    }

    // check the db to see if this frequency slug exists
    checkUniqueFrequencyName(editedSlug).then(bool => {
      if (editedSlug === this.props.slug) {
        this.setState({
          loading: false
        })

        return
      }

      if (bool === false) { // the slug is taken
        this.setState({
          exists: true,
          loading: false
        })
      } else { // the slug is available
        this.setState({
          loading: false,
          exists: false,
          error: this.state.error || null
        })
      }
    })
  }

  togglePrivacy = e => {
    this.setState({
      private: !this.state.private,
      disabled: false
    })
  }

  hideModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
    // setTimeout(() => { this.props.dispatch(hideModal()) }, 300)
    this.props.dispatch(hideModal());
  }

  prepareEditedFrequency = () => {
    // just in case a user tries to modify the html
    if (this.state.error || this.state.loading || this.state.exists || !this.state.name || !this.state.slug) {
      return
    }

    let frequencyObj = {
      id: this.props.id,
      name: this.state.name,
      slug: this.state.slug,
      settings: {
        private: this.state.private,
        tint: this.props.settings.tint
      }
    }

    this.props.dispatch(editFrequency(frequencyObj)).then(() => {
      this.props.dispatch(hideModal());

      // TODO: Figure out how to refresh the page if the slug changes
    })
  }

  deleteFrequency = () => {
    let id = this.props.id
    this.setState({
      deleteText: 'Deleting...'
    })

    this.props.dispatch(deleteFrequency(id)).then(() => {
      this.props.dispatch(hideModal());

      // TODO: Figure out how to refresh the page when it is deleted
    })
  }

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        contentLabel="Edit Frequency"
        onRequestClose={this.hideModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >

        <ModalContainer title={'Edit Frequency'} hideModal={this.hideModal}>
          <NameLabel>Change Name
            <NameInput ref="name" type="text" defaultValue={this.state.name} placeholder="Frequency Name..." onChange={this.handleChange} />
          </NameLabel>

          <EditSlug>
            <Pre error={this.state.exists}>spectrum.chat/~</Pre>
            <EditSlugInput ref="customSlug" type="text" placeholder={this.state.slug} defaultValue={this.state.slug} onChange={this.editSlug} />
          </EditSlug>

          {this.state.exists &&
            <ErrorMessage>Oops, a <a href={`/~${this.state.slug}`}>frequency with this name</a> already exists.</ErrorMessage>
          }

          {this.state.error &&
            <ErrorMessage>{this.state.error}</ErrorMessage>
          }

          {this.state.editedSlug &&
            <ErrorMessage warn>Just a heads up: if you edit your URL, anyone who visits your old link (<a href={`/~${this.props.slug}`}>spectrum.chat/~{this.props.slug}</a>) won't find your frequency.</ErrorMessage>
          }
          
          <Privacy>
            <PrivacyLabel>
              <PrivacyCheckbox type="checkbox" checked={this.state.private} onChange={this.togglePrivacy} />
              Private
            </PrivacyLabel>

            <PrivacyText>Only members will be able to see stories posted in this frequency. You will be able to approve and block specific people from this frequency.</PrivacyText>

            <PrivacyText>People will be able to request approval at <b>https://spectrum.chat/~{this.state.slug}</b></PrivacyText>
            <br />
          </Privacy>

          {this.state.deleteAttempted &&
            <DeleteWarning>Heads up: once you delete this frequency there's no going back. All the stories, members, messages and settings will be gone. You sure?</DeleteWarning>
          }
          
            {this.state.deleteAttempted
              ? <Footer>
                  <DeleteButton gray onClick={this.toggleDeleteAttempt}>Cancel</DeleteButton>
                  <BigDeleteButton onClick={this.deleteFrequency}>{this.state.deleteText}</BigDeleteButton>
                </Footer>
              : <Footer>
                  <DeleteButton onClick={this.toggleDeleteAttempt}>Delete Frequency</DeleteButton>
                  <SaveButton 
                    onClick={this.prepareEditedFrequency}
                    disabled={this.state.disabled || this.state.error || !this.state.name || !this.state.slug || this.state.exists}>Save</SaveButton>
                </Footer>
            }          
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(FrequencyEditModal);