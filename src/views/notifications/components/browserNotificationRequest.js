import React from 'react';
import { RequestCard, CloseRequest } from '../style';
import { FlexRow } from '../../../components/globals';
import { Button } from '../../../components/buttons';

const FirstRequest = ({ onSubscribe, onDismiss, loading }) => (
  <RequestCard>
    <p>
      <span role="img" aria-label="mailbox emoji">
        📬
      </span>{' '}
      Enable push notifications
    </p>
    <FlexRow>
      <Button
        icon="notification-fill"
        gradientTheme={'success'}
        onClick={onSubscribe}
        loading={loading}
      >
        Enable
      </Button>
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
