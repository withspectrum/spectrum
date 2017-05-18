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
import { editChannelMutation, deleteChannelMutation } from '../../api/channel';

class ChannelWithData extends Component {
  constructor(props) {
    super(props);

    const { channel } = this.props;

    this.state = {
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      isPrivate: channel.isPrivate || false,
      id: channel.id,
      channelData: channel,
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
      .editChannel(input)
      .then(({ data: { editChannel } }) => {
        const channel = editChannel;

        // the mutation returns a channel object. if it exists,
        if (channel !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', 'Channel saved!'));
        }
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err));
      });
  };

  triggerDeleteChannel = (e, id) => {
    e.preventDefault();
    const { name, channelData } = this.state;
    const message = (
      <div>
        <p>
          Are you sure you want to delete your channel,
          {' '}
          <b>{name}</b>
          {' '}
          (in the
          {' '}
          <b>{channelData.community.name}</b>
          {' '}
          community)?
        </p>
        {' '}
        <p>
          The
          {' '}
          <b>{channelData.metaData.threads} threads</b>
          {' '}
          posted in this channel will be deleted.
        </p>
        <p>
          All messages, reactions, and media shared in this channel will be deleted.
        </p>
        <p>This cannot be undone.</p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id,
        entity: 'channel',
        message,
        redirect: `/${channelData.community.slug}`,
      })
    );
  };

  render() {
    const { name, slug, description, isPrivate } = this.state;
    const { channel } = this.props;

    if (!channel) {
      return (
        <StyledCard>
          <FormTitle>This channel doesn't exist yet.</FormTitle>
          <Description>Want to make it?</Description>
          <Actions>
            <Button>Create</Button>
          </Actions>
        </StyledCard>
      );
    }

    return (
      <StyledCard>
        <FormTitle>Channel Settings</FormTitle>
        <Form>
          <Input defaultValue={name} id="name" onChange={this.handleChange}>
            Name
          </Input>
          {// general slug can't be edited
          slug === 'general'
            ? <UnderlineInput defaultValue={slug} disabled>
                {`sp.chat/${channel.community.slug}/`}
              </UnderlineInput>
            : <UnderlineInput
                defaultValue={slug}
                id="slug"
                onChange={this.handleChange}
              >
                {`sp.chat/${channel.community.slug}/`}
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
                Only approved people on Spectrum can see the threads, messages, and members in this channel. You can manually approve users who request to join this channel.
              </Description>
            : <Description>
                Anyone on Spectrum can join this channel, post threads and messages, and will be able to see other members.
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
                  onClick={e => this.triggerDeleteChannel(e, channel.id)}
                >
                  Delete Channel
                </TextButton>
              </Actions>
            : <Notice>
                The General channel is the default channel for your community. It can't be deleted, but you can still change the name and description.
              </Notice>}
        </Form>
      </StyledCard>
    );
  }
}

const Channel = compose(
  deleteChannelMutation,
  editChannelMutation,
  withRouter,
  pure
)(ChannelWithData);
export default connect()(Channel);
