import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { hideModal } from '../../../actions/modals';
import { addFrequency } from '../../../actions/frequencies';
import { checkUniqueFrequencyName } from '../../../helpers/utils';
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
  CreateButton,
  Privacy,
  PrivacyLabel,
  PrivacyCheckbox,
  PrivacyText
} from './style'

class FrequencyCreationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      name: '',
      slug: '',
      error: '',
      exists: false,
      editedSlug: false,
      private: false,
      loading: false
    };

    this.handleChange = debounce(this.handleChange, 200)
    this.editSlug = debounce(this.editSlug, 200) // query the server every 200ms instead of on every keystroke
  }

  handleChange = () => {
    let name = ReactDOM.findDOMNode(this.refs.name).value
    name.trim()
    let slug = slugg(name)

    this.setState({
      loading: true
    })

    // don't allow 'everything' to be used as it will conflict with our first party ~everything frequency
    if (name === 'everything') {
      this.setState({
        error: "Everything can't be a frequency name, sorry!"
      })
    }
    if (name.length > 20) {
      this.setState({
        error: "Frequency names can only be 20 characters long."
      })

      return
    }

    if (this.state.editedSlug) {
      this.setState({
        name: name,
        loading: false,
        error: null
      })
    } else {
      this.setState({
        name: name,
        slug: slug,
        error: null
      })

      // check the db to see if this frequency slug exists
      checkUniqueFrequencyName(slug).then(bool => {
        if (bool === false) { // the slug is taken
          this.setState({
            exists: true,
            loading: false
          })
        } else { // the slug is available
          this.setState({
            loading: false,
            exists: false,
            error: null
          })
        }
      })
    }
  }

  editSlug = () => {
    let customSlug = ReactDOM.findDOMNode(this.refs.customSlug).value
    customSlug.trim()
    let editedSlug = slugg(customSlug)

    this.setState({
      slug: editedSlug,
      editedSlug: true,
      loading: true
    })

    // check the db to see if this frequency slug exists
    checkUniqueFrequencyName(editedSlug).then(bool => {
      if (bool === false) { // the slug is taken
        this.setState({
          exists: true,
          loading: false
        })
      } else { // the slug is available
        this.setState({
          loading: false,
          exists: false,
          error: null
        })
      }
    })
  }

  togglePrivacy = e => {
    this.setState({
      private: !this.state.private
    })
  }

  hideModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
    // setTimeout(() => { this.props.dispatch(hideModal()) }, 300)
    this.props.dispatch(hideModal());
  };

  prepareNewFrequency = () => {
    // just in case a user tries to modify the html
    if (this.state.error || this.state.loading || this.state.exists || !this.state.name || !this.state.slug) {
      return
    }

    let frequencyObj = {
      name: this.state.name,
      slug: this.state.slug,
      private: this.state.private
    }

    this.props.dispatch(addFrequency(frequencyObj)).then(() => {
      this.props.dispatch(hideModal());
    })
  }

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        contentLabel="Create a Frequency"
        onRequestClose={this.hideModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >

        <ModalContainer title={'Create a Frequency'} hideModal={this.hideModal}>
          <NameLabel>Choose a Name
            <NameInput ref="name" autoFocus type="text" defaultValue={this.state.name} placeholder="Frequency Name..." onChange={this.handleChange} />
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
          
          <Privacy>
            <PrivacyLabel>
              <PrivacyCheckbox type="checkbox" value={this.state.privacy} onChange={this.togglePrivacy} />
              Private Frequency
            </PrivacyLabel>

            <PrivacyText>Only members will be able to see stories posted in this frequency. You will be able to approve and block specific people from this frequency.</PrivacyText>

            <PrivacyText>People will be able to request approval at <b>https://spectrum.chat/~{this.state.slug}</b></PrivacyText>
            <br />
          </Privacy>

          <Footer>
            <CreateButton 
              disabled={this.state.error || !this.state.name || this.state.loading || this.state.exists || !this.state.slug}
              onClick={this.prepareNewFrequency}>Create</CreateButton>
          </Footer>
        </ModalContainer>
      </Modal>
    );
  }
}

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this, args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(FrequencyCreationModal);