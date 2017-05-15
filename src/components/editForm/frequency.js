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
import { Button, TextButton } from '../buttons';
import { openModal } from '../../actions/modals';
import { Input, UnderlineInput, TextArea, Checkbox } from '../formElements';
import { addToastWithTimeout } from '../../actions/toasts';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  Notice,
} from './style';
import {
  editFrequencyMutation,
  deleteFrequencyMutation,
} from '../../api/frequency';

class FrequencyWithData extends Component {
  constructor(props) {
    super(props);

    const { frequency } = this.props;

    this.state = {
      name: frequency.name,
      slug: frequency.slug,
      description: frequency.description,
      isPrivate: frequency.isPrivate || false,
      id: frequency.id,
      frequencyData: frequency,
    };
  }

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;

    const newState = {};
    // checkboxes should reverse the value
    if (key === 'isPrivate') {
      newState[key] = value === 'on' ? false : true;
    } else {
      newState[key] = value;
    }

    this.setState(prevState => {
      return Object.assign({}, prevState, {
        ...newState,
      });
    });
  };

  save = e => {
    e.preventDefault();
    const { name, slug, description, isPrivate, id } = this.state;
    const input = {
      name,
      slug,
      description,
      isPrivate,
      id,
    };

    this.props
      .editFrequency(input)
      .then(({ data: { editFrequency } }) => {
        const frequency = editFrequency;

        // the mutation returns a frequency object. if it exists,
        if (frequency !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'Frequency saved!')
          );
        }
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err));
      });
  };

  triggerDeleteFrequency = (e, id) => {
    e.preventDefault();
    const { name, frequencyData } = this.state;
    const message = (
      <div>
        <p>
          Are you sure you want to delete your frequency,
          {' '}
          <b>{name}</b>
          {' '}
          (in the
          {' '}
          <b>{frequencyData.community.name}</b>
          {' '}
          community)?
        </p>
        {' '}
        <p>
          The
          {' '}
          <b>{frequencyData.metaData.stories} stories</b>
          {' '}
          posted in this frequency will be deleted.
        </p>
        <p>
          All messages, reactions, and media shared in this frequency will be deleted.
        </p>
        <p>This cannot be undone.</p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id,
        entity: 'frequency',
        message,
        redirect: `/${frequencyData.community.slug}`,
      })
    );
  };

  render() {
    const { name, slug, description, isPrivate } = this.state;
    const { frequency } = this.props;

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
          <Input defaultValue={name} id="name" onChange={this.handleChange}>
            Name
          </Input>
          {// general slug can't be edited
          slug === 'general'
            ? <UnderlineInput defaultValue={slug} disabled>
                {`sp.chat/${frequency.community.slug}/`}
              </UnderlineInput>
            : <UnderlineInput
                defaultValue={slug}
                id="slug"
                onChange={this.handleChange}
              >
                {`sp.chat/${frequency.community.slug}/`}
              </UnderlineInput>}
          <TextArea
            id="description"
            defaultValue={description}
            onChange={this.handleChange}
          >
            Description
          </TextArea>

          <Checkbox
            id="isPrivate"
            checked={isPrivate}
            onChange={this.handleChange}
          >
            Private channel
          </Checkbox>
          {isPrivate
            ? <Description>
                Only approved people on Spectrum can see the stories, messages, and members in this channel. You can manually approve users who request to join this channel.
              </Description>
            : <Description>
                Anyone on Spectrum can join this channel, post stories and messages, and will be able to see other members.
              </Description>}

          <Actions>
            <TextButton color={'warn.alt'}>Cancel</TextButton>
            <Button onClick={this.save}>Save</Button>
          </Actions>

          {// general can't be deleted
          slug !== 'general'
            ? <Actions>
                <TextButton
                  color={'warn.alt'}
                  onClick={e => this.triggerDeleteFrequency(e, frequency.id)}
                >
                  Delete Frequency
                </TextButton>
              </Actions>
            : <Notice>
                The General frequency is the default frequency for your community. It can't be deleted, but you can still change the name and description.
              </Notice>}
        </Form>
      </StyledCard>
    );
  }
}

const Frequency = compose(
  deleteFrequencyMutation,
  editFrequencyMutation,
  withRouter,
  pure
)(FrequencyWithData);
export default connect()(Frequency);
