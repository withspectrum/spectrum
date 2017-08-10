// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import { LinkPreview } from '../../components/linkPreview';
import Icon from '../../components/icons';
import { FlexRow, FlexCol } from '../../components/globals';
import { Avatar } from '../../components/avatar';
import FormattedThreadLocation from './formattedThreadLocation';
import {
  StyledThreadFeedCard,
  CardContent,
  CardLink,
  Title,
  Meta,
  MetaNew,
  MessageCount,
  Attachments,
  ParticipantCount,
  CreatorName,
  ThreadContext,
  ThreadContextMeta,
  ParticipantHeads,
  Location,
  Lock,
  Pinned,
  PinnedBanner,
  PinnedIconWrapper,
} from './style';

const ThreadFeedCardPure = (props: Object): React$Element<any> => {
  return (
    <StyledThreadFeedCard>
      <CardLink to={`?thread=${props.data.id}`} />
      <CardContent>
        {props.data.messageCount > 0 &&
          <MessageCount>
            <Icon size={20} glyph="message-fill" />
            <span>
              {props.data.messageCount}{' '}
              {props.data.messageCount > 1 ? ' messages' : ' message'}
            </span>
          </MessageCount>}
        <Link to={`?thread=${props.data.id}`}>
          <Title>
            {props.data.content.title}
          </Title>
          {props.isPinned &&
            <Pinned>
              <PinnedBanner />
              <PinnedIconWrapper>
                <Icon glyph="pin-fill" size={24} />
              </PinnedIconWrapper>
            </Pinned>}
        </Link>
        {// for now we know this means there is a link attachment
        props.data.attachments &&
          props.data.attachments.length > 0 &&
          props.data.attachments.map((attachment, i) => {
            if (attachment.attachmentType === 'linkPreview') {
              return (
                <Attachments key={i}>
                  <LinkPreview
                    trueUrl={attachment.data.trueUrl}
                    data={JSON.parse(attachment.data)}
                    size={'small'}
                    editable={false}
                    margin={'8px 0 12px'}
                  />
                </Attachments>
              );
            } else {
              return null;
            }
          })}
        <FormattedThreadLocation {...props} />
      </CardContent>
    </StyledThreadFeedCard>
  );
};

const ThreadFeedCard = compose(pure)(ThreadFeedCardPure);
export default connect()(ThreadFeedCard);
