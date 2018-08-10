import React from 'react';
import { RequestCard, CloseRequest } from '../style';
import { FlexRow } from 'src/components/globals';
import Icon from 'src/components/icon';
import { PrimaryButton } from 'src/components/button';

const FirstRequest = ({ onSubscribe, onDismiss, loading }) => (
  <RequestCard>
    <p>
      <span role="img" aria-label="mailbox emoji">
        📬
      </span>{' '}
      We need your permission to enable push notifications:
    </p>
    <FlexRow>
      <PrimaryButton onClick={onSubscribe} loading={loading}>
        <Icon glyph="notification-fill" />
        Enable
      </PrimaryButton>
      <CloseRequest
        glyph="view-close"
        color="text.placeholder"
        hoverColor="warn.alt"
        tipText="Dismiss"
        tipLocation="top-left"
        onClick={onDismiss}
      />
    </FlexRow>
  </RequestCard>
);

const BrowserNotificationRequest = ({ onSubscribe, onDismiss, loading }) => (
  <FirstRequest
    onSubscribe={onSubscribe}
    onDismiss={onDismiss}
    loading={loading}
  />
);

export default BrowserNotificationRequest;
