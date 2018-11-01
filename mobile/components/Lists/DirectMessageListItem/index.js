// @flow
import React, { Component } from 'react';
import Avatar from '../../Avatar';
import { ListItem } from '../ListItem';
import {
  TextColumnContainer,
  TextRowContainer,
  TitleTextContainer,
  Title,
  Subtitle,
  AvatarWrapper,
  TimestampTextContainer,
  Timestamp,
} from '../style';
import {
  MultiAvatarWrapper,
  DoubleAvatarFirst,
  DoubleAvatarSecond,
  TripleAvatarFirst,
  TripleAvatarSecond,
  TripleAvatarThird,
  QuadrupleAvatarFirst,
  QuadrupleAvatarSecond,
  QuadrupleAvatarThird,
  QuadrupleAvatarFourth,
  OverflowAvatar,
  OverflowAvatarLabel,
} from './style';

type Props = {
  onPressHandler: Function,
  participants: Array<Object>,
  title: string,
  subtitle: string,
  timestamp: string,
  unread?: boolean,
};

export class DirectMessageListItem extends Component<Props> {
  renderParticipantAvatars = () => {
    const { participants } = this.props;
    if (!participants || participants.length === 0) return null;
    if (participants.length === 1) {
      return (
        <Avatar
          key={'avatar-' + participants[0].id}
          src={participants[0].profilePhoto}
          size={44}
        />
      );
    }
    if (participants.length === 2) {
      return (
        <MultiAvatarWrapper>
          <DoubleAvatarFirst>
            <Avatar
              key={'avatar-' + participants[0].id}
              src={participants[0].profilePhoto}
              size={36}
            />
          </DoubleAvatarFirst>

          <DoubleAvatarSecond>
            <Avatar
              key={'avatar-' + participants[1].id}
              src={participants[1].profilePhoto}
              size={36}
            />
          </DoubleAvatarSecond>
        </MultiAvatarWrapper>
      );
    }

    if (participants.length === 3) {
      return (
        <MultiAvatarWrapper>
          <TripleAvatarFirst>
            <Avatar
              key={'avatar-' + participants[0].id}
              src={participants[0].profilePhoto}
              size={24}
            />
          </TripleAvatarFirst>

          <TripleAvatarSecond>
            <Avatar
              key={'avatar-' + participants[1].id}
              src={participants[1].profilePhoto}
              size={24}
            />
          </TripleAvatarSecond>

          <TripleAvatarThird>
            <Avatar
              key={'avatar-' + participants[2].id}
              src={participants[2].profilePhoto}
              size={24}
            />
          </TripleAvatarThird>
        </MultiAvatarWrapper>
      );
    }

    if (participants.length === 4) {
      return (
        <MultiAvatarWrapper>
          <QuadrupleAvatarFirst>
            <Avatar
              key={'avatar-' + participants[0].id}
              src={participants[0].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarFirst>

          <QuadrupleAvatarSecond>
            <Avatar
              key={'avatar-' + participants[1].id}
              src={participants[1].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarSecond>

          <QuadrupleAvatarThird>
            <Avatar
              key={'avatar-' + participants[2].id}
              src={participants[2].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarThird>

          <QuadrupleAvatarFourth>
            <Avatar
              key={'avatar-' + participants[2].id}
              src={participants[2].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarFourth>
        </MultiAvatarWrapper>
      );
    }

    if (participants.length > 4) {
      return (
        <MultiAvatarWrapper>
          <QuadrupleAvatarFirst>
            <Avatar
              key={'avatar-' + participants[0].id}
              src={participants[0].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarFirst>

          <QuadrupleAvatarSecond>
            <Avatar
              key={'avatar-' + participants[1].id}
              src={participants[1].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarSecond>

          <QuadrupleAvatarThird>
            <Avatar
              key={'avatar-' + participants[2].id}
              src={participants[2].profilePhoto}
              size={24}
            />
          </QuadrupleAvatarThird>

          <OverflowAvatar>
            <OverflowAvatarLabel>
              +{participants.length - 4}
            </OverflowAvatarLabel>
          </OverflowAvatar>
        </MultiAvatarWrapper>
      );
    }
  };

  render() {
    const { onPressHandler, title, subtitle, timestamp, unread } = this.props;

    return (
      <ListItem onPressHandler={onPressHandler}>
        <AvatarWrapper>{this.renderParticipantAvatars()}</AvatarWrapper>

        <TextColumnContainer>
          <TextRowContainer>
            <TitleTextContainer>
              <Title numberOfLines={1} weight={unread && 'bold'}>
                {title}
              </Title>
            </TitleTextContainer>

            <TimestampTextContainer>
              <Timestamp
                type={'body'}
                color={unread ? theme => theme.brand.default : undefined}
                light
              >
                {timestamp}
              </Timestamp>
            </TimestampTextContainer>
          </TextRowContainer>

          <Subtitle
            weight={unread && 'bold'}
            color={unread ? theme => theme.text.default : undefined}
            numberOfLines={2}
          >
            {subtitle}
          </Subtitle>
        </TextColumnContainer>
      </ListItem>
    );
  }
}
