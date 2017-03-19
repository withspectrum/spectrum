import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { checkUniqueUsername, setUsernameAndEmail } from '../../../db/users';
import { modalStyles, Footer, ErrorMessage } from '../FrequencyEditModal/style';
import { debounce } from '../../../helpers/utils';
import { Label, Input } from '../../Globals';
import { Button } from '../../Globals';

class AddEmailModal extends React.Component {
  state = {
    username: '',
    email: '',
    error: null,
  };

  constructor() {
    super();
    this.checkUsername = debounce(this.checkUsername, 500);
  }

  changeUsername = e => {
    this.setState({
      username: e.target.value,
    });

    if (e.target.value > 20) {
      this.setState({
        error: 'Getting a bit ahead of yourself, eh? Keep it to a maximum of 20 characters, please.',
      });
      return;
    }
    if (e.target.value.length === 0) {
      return;
    }

    this.setState({
      loading: true,
    });

    this.checkUsername();
  };

  checkUsername = () => {
    checkUniqueUsername(this.state.username, this.props.uid).then(free => {
      this.setState({
        error: !free && 'Oops, a user with this name already exists.',
        loading: false,
      });
    });
  };

  changeEmail = e => {
    this.setState({
      email: e.target.value,
    });
  };

  submit = e => {
    e && e.preventDefault();
    setUsernameAndEmail({
      uid: this.props.uid,
      email: this.state.email,
      username: this.state.username,
    }).then(() => {
      this.props.onClose();
    });
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel="Enter your username"
        onRequestClose={this.props.onClose}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          title={`We're working on user profiles...`}
          closeModal={this.props.onClose}
        >
          <form onSubmit={this.submit}>
            <Label>
              Reserve your username
              <Input
                ref="name"
                type="text"
                value={this.state.username}
                placeholder="aschwarzenegger"
                onChange={this.changeUsername}
              />
            </Label>

            {this.state.error &&
              <ErrorMessage>{this.state.error}</ErrorMessage>}

            {this.props.promptEmail &&
              <Label>
                Secure your account with an email
                <Input
                  ref="name"
                  type="email"
                  value={this.state.email}
                  placeholder="me@arnold.at"
                  onChange={this.changeEmail}
                />
              </Label>}

            <Footer>
              <Button
                onClick={this.submit}
                disabled={
                  this.state.loading ||
                    this.state.exists ||
                    this.state.username.length === 0 ||
                    this.state.error ||
                    this.props.promptEmail && !/^.+@.+$/.test(this.state.email)
                }
              >
                Save
              </Button>
            </Footer>
          </form>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.user.uid,
});

export default connect(mapStateToProps)(AddEmailModal);
