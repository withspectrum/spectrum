import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { closeModal } from '../../../actions/modals';
import Icon from '../../../shared/Icons';
import { track } from '../../../EventTracker';
import { createFrequency } from '../../../actions/frequencies';
import {
  Button,
  TextButton,
  Label,
  Input,
  TextArea,
  UnderlineInput,
  PrefixLabel,
} from '../../Globals';
import { checkUniqueFrequencyName } from '../../../db/frequencies';
import { debounce } from '../../../helpers/utils';
import { connect } from 'react-redux';
import slugg from 'slugg';
import {
  HiddenInput,
  modalStyles,
  Footer,
  ErrorMessage,
  CheckboxWrapper,
} from './style';

class FrequencyCreationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      slug: '',
      description: '',
      error: '',
      exists: false,
      editedSlug: false,
      private: false,
      loading: false,
      acceptCoC: false,
    };

    this.handleChange = debounce(this.handleChange, 500);
    this.editSlug = debounce(this.editSlug, 500); // query the server every 200ms instead of on every keystroke
  }

  handleChange = () => {
    let name = ReactDOM.findDOMNode(this.refs.name).value;
    let lowercaseName = name.toLowerCase().trim();
    name.trim();
    let slug = slugg(name);

    // don't allow 'everything' to be used as it will conflict with our first party ~everything frequency
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

    if (this.state.editedSlug) {
      this.setState({
        name: name,
        loading: false,
        error: null,
      });
    } else {
      this.setState({
        name: name,
        slug: slug,
        error: null,
      });

      // check the db to see if this frequency slug exists
      checkUniqueFrequencyName(slug).then(bool => {
        if (bool === false) {
          // the slug is taken
          this.setState({
            exists: true,
            loading: false,
          });
        } else {
          // the slug is available
          this.setState({
            loading: false,
            exists: false,
            error: null,
          });
        }
      });
    }
  };

  editSlug = () => {
    let customSlug = ReactDOM.findDOMNode(this.refs.customSlug).value;
    customSlug.trim();
    let editedSlug = slugg(customSlug);

    this.setState({
      slug: editedSlug,
      editedSlug: true,
      loading: true,
    });

    if (
      editedSlug === 'everything' ||
      editedSlug === 'null' ||
      editedSlug === 'undefined'
    ) {
      this.setState({
        error: "~everything, ~null, and ~undefined can't be used, but nice try!",
      });

      return;
    }

    if (editedSlug.length > 20) {
      this.setState({
        error: "Getting a bit carried away now, eh? It's best to use a shorter, more memorable URL (less than 20 characters).",
      });

      return;
    }

    // check the db to see if this frequency slug exists
    checkUniqueFrequencyName(editedSlug).then(bool => {
      if (bool === false) {
        // the slug is taken
        this.setState({
          exists: true,
          loading: false,
        });
      } else {
        // the slug is available
        this.setState({
          loading: false,
          exists: false,
          error: null,
        });
      }
    });
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
    });
  };

  togglePrivacy = e => {
    this.setState({
      private: !this.state.private,
    });
  };

  toggleCoC = e => {
    this.setState(prevState => ({
      acceptCoC: !prevState.acceptCoC,
    }));
  };

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  prepareNewFrequency = () => {
    if (this.state.editedSlug) {
      // if the user edited the slug, let's keep an eye out
      track('frequency', 'slug edited', null);
    }

    // just in case a user tries to modify the html
    if (
      this.state.error ||
      this.state.loading ||
      this.state.exists ||
      !this.state.name ||
      !this.state.slug ||
      !this.state.description ||
      !this.state.acceptCoC
    ) {
      return;
    }

    let frequencyObj = {
      name: this.state.name.toString(),
      slug: this.state.slug.toString(),
      private: this.state.private,
      description: this.state.description.toString(),
    };

    this.props.dispatch(createFrequency(frequencyObj));
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel="Create a Frequency"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >

        <ModalContainer
          title={'Create a new frequency!'}
          closeModal={this.closeModal}
        >
          <Label>
            What should we call it?
            <Input
              ref="name"
              autoFocus
              type="text"
              defaultValue={this.state.name}
              placeholder="Make it memorable!"
              onChange={this.handleChange}
            />
          </Label>

          <PrefixLabel>
            spectrum.chat/~
            <UnderlineInput
              ref="customSlug"
              type="text"
              placeholder={this.state.slug}
              defaultValue={this.state.slug}
              onChange={this.editSlug}
            />
          </PrefixLabel>

          <Label>
            Describe it in 140 characters or less...
            <TextArea
              ref="customDescription"
              placeholder={'What will make people love it?'}
              defaultValue={this.state.description}
              onChange={this.editDescription}
            />
          </Label>

          <Label>
            <CheckboxWrapper>
              {this.state.acceptCoC
                ? <Icon icon="checked" />
                : <Icon icon="unchecked" subtle />}
              <HiddenInput
                type="checkbox"
                checked={this.state.acceptCoC}
                onChange={this.toggleCoC}
              />
              I have read the{' '}
              <a
                href="https://github.com/withspectrum/code-of-conduct"
                target="_blank"
              >
                Spectrum Code of Conduct
              </a>
              {' '}and agree to enforce it in my community.
            </CheckboxWrapper>
          </Label>

          {this.state.exists &&
            <ErrorMessage>
              Oops, a{' '}
              <a href={`/~${this.state.slug}`}>frequency with this name</a>
              {' '}already exists.
            </ErrorMessage>}

          {this.state.error && <ErrorMessage>{this.state.error}</ErrorMessage>}

          <Footer>
            <TextButton onClick={this.closeModal}>Cancel</TextButton>
            <Button
              disabled={
                this.state.error ||
                  !this.state.name ||
                  this.state.loading ||
                  this.state.exists ||
                  !this.state.slug ||
                  this.state.description.length === 0 ||
                  !this.state.acceptCoC
              }
              onClick={this.prepareNewFrequency}
            >
              Create
            </Button>
          </Footer>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(FrequencyCreationModal);
