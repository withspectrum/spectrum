// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { closeModal } from 'src/actions/modals';
import type { Dispatch } from 'redux';
import ModalContainer from '../modalContainer';
import { TextButton, PrimaryButton } from 'src/components/button';
import { modalStyles } from '../styles';
import { Form, Actions } from './style';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  imageURL: ?string,
};

type State = {
  crop: Object,
  croppedImageUrl: ?string,
};

class ReportUserModal extends React.Component<Props, State> {
  state = {
    crop: {
      unit: '%',
      width: 30,
      aspect: 1,
    },
    croppedImageUrl: '',
  };
  close = () => {
    this.props.dispatch(closeModal());
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'image.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  crop = e => {
    e.preventDefault();
    const { croppedImageUrl } = this.state;
    const { targetName } = this.props;
    this.props.crop(croppedImageUrl, targetName);
    this.close();
  };
  render() {
    const { isOpen, image } = this.props;
    const { crop } = this.state;

    const styles = modalStyles(420);

    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
                We pass the closeModal dispatch into the container to attach
                the action to the 'close' icon in the top right corner of all modals
            */}
        <ModalContainer title={`Crop the image`} closeModal={this.close}>
          <ReactCrop
            src={image}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
          <Form>
            <Actions>
              <TextButton onClick={this.close}> Cancel </TextButton>
              <PrimaryButton onClick={this.crop}> Crop </PrimaryButton>
            </Actions>
          </Form>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  isOpen: state.modals.isOpen,
});

export default compose(
  // $FlowIssue
  connect(map)
)(ReportUserModal);
