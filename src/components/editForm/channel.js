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
import { editChannelMutation, deleteChannelMutation } from '../../api/channel';
import { openModal } from '../../actions/modals';
import { addToastWithTimeout } from '../../actions/toasts';
import { Notice } from '../listCard/style';
import { Button, TextButton } from '../buttons';
import { NullCard } from '../upsell';
import { Input, UnderlineInput, TextArea, Checkbox } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  GeneralNotice,
} from './style';

class ChannelWithData extends Component {
  state: {
    name: string,
    slug: string,
    description: string,
    isPrivate: boolean,
    channelId: string,
    channelData: Object,
  };
  constructor(props) {
    super(props);

    const { channel } = this.props;

    this.state = {
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      isPrivate: channel.isPrivate || false,
      channelId: channel.id,
      channelData: channel,
    };
  }

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;
    const { isPrivate } = this.state;

    const newState = {};
    // checkboxes should reverse the value
    if (key === 'isPrivate') {
      newState[key] = !isPrivate;
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
    const { name, slug, description, isPrivate, channelId } = this.state;
    const input = {
      name,
      slug,
      description,
      isPrivate,
      channelId,
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
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  triggerDeleteChannel = (e, channelId) => {
    e.preventDefault();
    const { name, channelData } = this.state;
    const message = (
      <div>
        <p>
          Are you sure you want to delete
          {' '}
          <b>{channelData.community.name}/{name}</b>
          ?
        </p>
        {channelData.metaData.threads > 0 &&
          <p>
            The
            {' '}
            <b>{channelData.metaData.threads} threads</b>
            {' '}
            posted in this channel will be deleted.
          </p>}
        <p>
          All messages, reactions, and media shared in this channel will be deleted.
        </p>
        <p><b>This cannot be undone.</b></p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: channelId,
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
        <NullCard
          bg="channel"
          heading={`This channel doesn't exist yet.`}
          copy={`Want to make it?`}
        >
          {/* TODO: wire up button */}
          <Button>Create</Button>
        </NullCard>
      );
    } else {
      return (
        <StyledCard>
          <FormTitle>Channel Settings</FormTitle>
          <Form>
            <Input defaultValue={name} id="name" onChange={this.handleChange}>
              Name
            </Input>
            <UnderlineInput defaultValue={slug} disabled>
              {`sp.chat/${channel.community.slug}/`}
            </UnderlineInput>
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

            {// if the user is moving from private to public
            this.props.channel.isPrivate &&
              !isPrivate &&
              <Notice>
                When a private channel is made public all pending users will be added as members of the channel. Blocked users will remain blocked from viewing all content in this channel but in the future any new person will be able to join.
              </Notice>}

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
              : <GeneralNotice>
                  The General channel is the default channel for your community. It can't be deleted, but you can still change the name and description.
                </GeneralNotice>}
          </Form>
        </StyledCard>
      );
    }
  }
}

const Channel = compose(
  deleteChannelMutation,
  editChannelMutation,
  withRouter,
  pure
)(ChannelWithData);
export default connect()(Channel);
