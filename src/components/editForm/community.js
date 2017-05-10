// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Button, LinkButton } from '../buttons';
import { LoadingCard } from '../loading';
import { Input, UnderlineInput, TextArea } from '../formElements';
import { StyledCard, Form, FormTitle, Description, Actions } from './style';
import {
  editCommunityMutation,
  deleteCommunityMutation,
} from '../../api/community';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

class CommunityWithData extends Component {
  constructor(props) {
    super(props);

    const { data: { community } } = this.props;
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description,
      id: community.id,
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

  save = e => {
    e.preventDefault();
    const { name, slug, description, id } = this.state;
    const input = {
      name,
      slug,
      description,
      id,
    };
    this.props
      .editCommunity(input)
      .then(community => {
        if (community !== undefined) {
          // community was successfully edited
          this.props.history.push(`/${community.slug}`);
        }
      })
      .catch(err => {
        //TODO: Add dispatch for global error events
        console.log('err in editCommunity', err);
      });
  };

  triggerDeleteCommunity = e => {
    e.preventDefault();

    const { data: { community }, deleteCommunity, history } = this.props;

    deleteCommunity(community.id)
      .then(community => {
        if (community !== undefined) {
          // community was successfully deleted
          history.push(`/`);
        }
      })
      .catch(err => {
        // TODO: Throw a global dispatch for error message
        console.log('err in deleteCommunity', err);
      });
  };

  render() {
    const { name, slug, description } = this.state;
    const { data: { community } } = this.props;

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
  displayLoadingState,
  withRouter,
  pure
)(CommunityWithData);
export default connect()(Community);
