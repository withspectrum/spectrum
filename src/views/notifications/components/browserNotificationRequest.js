// @flow
import React from 'react';
import { RequestCard, CloseRequest } from '../style';
import { FlexRow } from '../../../components/globals';
import { Button } from '../../../components/buttons';

const FirstRequest = ({ onSubscribe, onDismiss }) =>
  <RequestCard>
    <p>📬 We need your permission to enable push notifications:</p>
    <FlexRow>
      <Button
        icon="notification-fill"
        gradientTheme={'success'}
        onClick={onSubscribe}
      >
        Enable
      </Button>
      <CloseRequest
        glyph="view-close"
        color="text.placeholder"
        hoverColor="warn.alt"
        tipText="Dismiss"
        tipLocation="top-left"
        onClick={onDismiss}
      />
    </FlexRow>
  </RequestCard>;

const BrowserNotificationRequest = ({ onSubscribe, onDismiss }) =>
  <FirstRequest onSubscribe={onSubscribe} onDismiss={onDismiss} />;

export default BrowserNotificationRequest;
