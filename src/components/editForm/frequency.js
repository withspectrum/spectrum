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
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Button, LinkButton } from '../buttons';
import { LoadingCard } from '../loading';
import { Input, UnderlineInput, TextArea } from '../formElements';
import { StyledCard, Form, FormTitle, Description, Actions } from './style';
import {
  editFrequencyMutation,
  deleteFrequencyMutation,
} from '../../api/frequency';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type FrequencyProps = {
  id: String,
  name: String,
  slug: String,
  description: String,
};

class FrequencyWithData extends Component {
  constructor(props) {
    super(props);

    const { data: { frequency } } = this.props;
    this.state = {
      name: frequency.name,
      slug: frequency.slug,
      description: frequency.description,
      id: frequency.id,
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
    const { data: { frequency: { community } } } = this.props;
    const input = {
      name,
      slug,
      description,
      id,
    };
    this.props
      .editFrequency(input)
      .then(frequency => {
        if (frequency !== undefined) {
          // community was successfully edited
          this.props.history.push(`/${community.slug}/${frequency.slug}`);
        }
      })
      .catch(err => {
        //TODO: Add dispatch for global error events
        console.log('err in editCommunity', err);
      });
  };

  triggerDeleteFrequency = e => {
    e.preventDefault();

    const {
      data: { frequency, frequency: { community } },
      deleteFrequency,
      history,
    } = this.props;

    deleteFrequency(frequency.id)
      .then(frequency => {
        if (frequency !== undefined) {
          // community was successfully deleted
          history.push(`/${community.slug}`);
        }
      })
      .catch(err => {
        // TODO: Throw a global dispatch for error message
        console.log('err in deleteFrequency', err);
      });
  };

  render() {
    const { name, slug, description } = this.state;
    const { data: { frequency } } = this.props;

    if (!frequency) {
      return (
        <StyledCard>
          <FormTitle>This frequency doesn't exist yet.</FormTitle>
          <Description>Want to make it?</Description>
          <Actions>
            <Button>Create</Button>
          </Actions>
        </StyledCard>
      );
    }

    return (
      <StyledCard>
        <FormTitle>Frequency Settings</FormTitle>
        <Form>
          <Input defaultValue={name} onChange={this.changeName}>Name</Input>
          <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
            {`sp.chat/${frequency.community.slug}/`}
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
              onClick={this.triggerDeleteFrequency}
            >
              Delete Frequency
            </LinkButton>
          </Actions>
        </Form>
      </StyledCard>
    );
  }
}

const Frequency = compose(
  deleteFrequencyMutation,
  editFrequencyMutation,
  displayLoadingState,
  withRouter,
  pure
)(FrequencyWithData);
export default connect()(Frequency);
