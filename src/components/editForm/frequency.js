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
      id: frequency.id,
      frequencyData: frequency,
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
    const { name, slug, description } = this.state;
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
          <Input defaultValue={name} onChange={this.changeName}>Name</Input>
          {// general slug can't be edited
          slug === 'general'
            ? <UnderlineInput defaultValue={slug} disabled>
                {`sp.chat/${frequency.community.slug}/`}
              </UnderlineInput>
            : <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
                {`sp.chat/${frequency.community.slug}/`}
              </UnderlineInput>}
          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Description
          </TextArea>

          <Checkbox>Private?</Checkbox>

          <Actions>
            <LinkButton color={'warn.alt'}>Cancel</LinkButton>
            <Button onClick={this.save}>Save</Button>
          </Actions>

          {// general can't be deleted
          slug !== 'general'
            ? <Actions>
                <LinkButton
                  color={'warn.alt'}
                  onClick={e => this.triggerDeleteFrequency(e, frequency.id)}
                >
                  Delete Frequency
                </LinkButton>
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
