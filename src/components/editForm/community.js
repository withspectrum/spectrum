// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Button, LinkButton } from '../buttons';
import { addToastWithTimeout } from '../../actions/toasts';
import { Input, UnderlineInput, TextArea } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  ImgPreview,
} from './style';
import {
  editCommunityMutation,
  deleteCommunityMutation,
} from '../../api/community';

class CommunityWithData extends Component {
  constructor(props) {
    super(props);

    const { community } = this.props;
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description,
      id: community.id,
      website: community.website,
      image: community.photoURL,
      file: null,
    };
  }

  changeName = e => {
    const name = e.target.value;
    this.setState({
      name,
    });
  };

  changeDescription = e => {
    const description = e.target.value;
    this.setState({
      description,
    });
  };

  changeSlug = e => {
    const slug = e.target.value;
    this.setState({
      slug,
    });
  };

  changeWebsite = e => {
    const website = e.target.value;
    this.setState({
      website,
    });
  };

  setCommunityPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  save = e => {
    e.preventDefault();
    const { name, slug, description, website, file, id } = this.state;
    const input = {
      name,
      slug,
      description,
      website,
      file,
      id,
    };
    this.props
      .editCommunity(input)
      .then(({ data: { editCommunity } }) => {
        const community = editCommunity;

        // community was returned
        if (community !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'Community saved!')
          );
        }
      })
      .catch(err => {
        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `Something went wrong and we weren't able to save these changes. ${err}`
          )
        );
      });
  };

  triggerDeleteCommunity = e => {
    e.preventDefault();
    const { community, deleteCommunity, history } = this.props;

    deleteCommunity(community.id)
      .then(({ data: { deleteCommunity } }) => {
        if (deleteCommunity) {
          // community was successfully deleted
          history.push(`/`);
          this.props.dispatch(
            addToastWithTimeout('neutral', 'Community deleted.')
          );
        }
      })
      .catch(err => {
        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `Something went wrong and we weren't able to delete this community. ${err}`
          )
        );
      });
  };

  render() {
    const { name, slug, description, image, website } = this.state;
    const { community } = this.props;

    if (!community) {
      return (
        <StyledCard>
          <FormTitle>This community doesn't exist yet.</FormTitle>
          <Description>Want to make it?</Description>
          <Actions>
            <Button>Create</Button>
          </Actions>
        </StyledCard>
      );
    }

    return (
      <StyledCard>
        <FormTitle>Community Settings</FormTitle>
        <Form>
          <Input defaultValue={name} onChange={this.changeName}>Name</Input>
          <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
            sp.chat/
          </UnderlineInput>
          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Description
          </TextArea>

          <Input
            inputType="file"
            accept=".png, .jpg, .jpeg, .gif"
            defaultValue={name}
            onChange={this.setCommunityPhoto}
            multiple={false}
          >
            Add a logo or photo

            {!image ? <span>add</span> : <ImgPreview src={image} />}
          </Input>

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            autoFocus={true}
          >
            Optional: Add your community's website
          </Input>

          <Actions>
            <LinkButton color={'warn.alt'}>Cancel</LinkButton>
            <Button onClick={this.save}>Save</Button>
          </Actions>

          <Actions>
            <LinkButton
              color={'warn.alt'}
              onClick={this.triggerDeleteCommunity}
            >
              Delete Community
            </LinkButton>
          </Actions>
        </Form>
      </StyledCard>
    );
  }
}

const Community = compose(
  deleteCommunityMutation,
  editCommunityMutation,
  withRouter,
  pure
)(CommunityWithData);
export default connect()(Community);
