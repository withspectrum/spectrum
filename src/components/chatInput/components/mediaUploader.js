// @flow
import * as React from 'react';
import { MediaLabel, MediaInput } from './style';
import Icon from 'src/components/icons';
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
};

class MediaUploader extends React.Component<Props> {
  form: any;

  validateUpload = (validity: Object, file: ?Object) => {
    const { currentUser } = this.props;

    if (!currentUser)
      return this.props.onError('You must be signed in to upload images');
    if (!file) return this.props.onError('');
    if (!validity.valid)
      return this.props.onError(
        "We couldn't validate this upload, please try uploading another file"
      );

    if (
      file &&
      file.size > FREE_USER_MAX_IMAGE_SIZE_BYTES &&
      !currentUser.isPro
    ) {
      return this.props.onError(
        `Upgrade to Pro to upload files up to ${PRO_USER_MAX_IMAGE_SIZE_STRING}. Otherwise, try uploading a photo less than ${FREE_USER_MAX_IMAGE_SIZE_STRING}.`
      );
    }

    if (
      file &&
      file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES &&
      currentUser.isPro
    ) {
      return this.props.onError(
        `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`
      );
    }

    // if it makes it this far, there is not an error we can detect
    this.props.onError('');
    // send back the validated file
    this.props.onValidated(file);
    // clear the form so that another image can be uploaded
    return this.clearForm();
  };

  onChange = (e: any) => {
    const { target: { validity, files: [file] } } = e;

    if (!file) return;

    return this.validateUpload(validity, file);
  };

  clearForm = () => {
    if (this.form) {
      this.form.reset();
    }
  };

  componentDidMount() {
    return this.clearForm();
  }

  componentWillUnmount() {
    return this.clearForm();
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} ref={c => (this.form = c)}>
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
      </form>
    );
  }
}

export default MediaUploader;
