// @flow
import * as React from 'react';
import { MediaLabel, MediaInput, Form } from './style';
import Icon from 'src/components/icons';
import { Loading } from 'src/components/loading';
import {
  PRO_USER_MAX_IMAGE_SIZE_STRING,
  PRO_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_STRING,
} from 'src/helpers/images';

type Props = {
  onValidated: Function,
  onError: Function,
  currentUser: ?Object,
  isSendingMediaMessage: boolean,
  inputFocused: boolean,
};

class MediaUploader extends React.Component<Props> {
  form: any;

  validate = (validity: Object, file: ?Object) => {
    const { currentUser } = this.props;

    if (!currentUser) return 'You must be signed in to upload images';
    if (!file) return this.props.onError('');
    if (!validity.valid)
      return "We couldn't validate this upload, please try uploading another file";

    if (
      file &&
      file.size > FREE_USER_MAX_IMAGE_SIZE_BYTES &&
      !currentUser.isPro
    ) {
      return `Upgrade to Pro to upload files up to ${PRO_USER_MAX_IMAGE_SIZE_STRING}. Otherwise, try uploading a photo less than ${FREE_USER_MAX_IMAGE_SIZE_STRING}.`;
    }

    if (
      file &&
      file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES &&
      currentUser.isPro
    ) {
      return `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`;
    }

    // if it makes it this far, there is not an error we can detect
    return null;
  };

  validatePreview = (validity: Object, file: ?Object) => {
    const validationResult = this.validate(validity, file);
    if (validationResult !== null) {
      return this.props.onError(validationResult);
    }
    this.props.onError('');
    // clear the form so that another image can be uploaded
    this.clearForm();
    // send back the validated file
    return this.props.onValidated(file);
  };

  onChange = (e: any) => {
    const { target: { validity, files: [file] } } = e;

    if (!file) return;

    return this.validatePreview(validity, file);
  };

  clearForm = () => {
    if (this.form) {
      this.form.reset();
    }
  };

  componentDidMount() {
    document.addEventListener('paste', this.onPaste, true);
    return this.clearForm();
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.onPaste);
    return this.clearForm();
  }

  onPaste = (event: any) => {
    // Ensure that the image is only pasted if user focuses input
    if (!this.props.inputFocused) {
      return;
    }
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    if (!items) {
      return;
    }
    for (let item of items) {
      if (item.kind === 'file' && item.type.includes('image/')) {
        this.validatePreview({ valid: true }, item.getAsFile());
        break;
      }
    }
  };

  render() {
    const { isSendingMediaMessage } = this.props;

    if (isSendingMediaMessage) {
      return (
        <MediaLabel>
          <Loading />
        </MediaLabel>
      );
    }

    return (
      <Form
        onSubmit={e => e.preventDefault()}
        innerRef={c => (this.form = c)}
        data-cy="chat-input-media-uploader"
      >
        <MediaLabel>
          <MediaInput
            type="file"
            accept={'.png, .jpg, .jpeg, .gif, .mp4'}
            multiple={false}
            onChange={this.onChange}
          />
          <Icon
            glyph="photo"
            tipLocation={'top-right'}
            tipText="Upload photo"
          />
        </MediaLabel>
      </Form>
    );
  }
}

export default MediaUploader;
