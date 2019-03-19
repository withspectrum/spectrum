import React from 'react';
import { RequestCard, CloseRequest } from '../style';
import { FlexRow } from 'src/components/globals';
import { PrimaryButton } from 'src/components/button';

const FirstRequest = ({ onSubscribe, onDismiss, loading }) => (
  <RequestCard>
    <p>
      <span role="img" aria-label="mailbox emoji">
        📬
      </span>{' '}
      Enable push notifications
    </p>
    <FlexRow>
      <PrimaryButton onClick={onSubscribe} loading={loading}>
        Enable
      </PrimaryButton>
      <CloseRequest
        glyph="view-close"
        color="text.placeholder"
        hoverColor="warn.alt"
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
