// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Container, ErrorToast, SuccessToast, NeutralToast } from './style';

const ToastsPure = ({ toasts }): React$Element<any> => {
  if (!toasts) {
    return <span />;
  }

  return (
    <Container>
      {toasts.map(toast => {
        const { kind, timeout, message, id } = toast;
        switch (kind) {
          case 'error': {
            let cleanedMessage = message;
            if (message.indexOf('GraphQL error: ') >= 0) {
              cleanedMessage = message.replace('GraphQL error: ', '');
            }
            return (
              <ErrorToast key={id} timeout={timeout}>
                {cleanedMessage}
              </ErrorToast>
            );
          }
          case 'success': {
            return (
              <SuccessToast key={id} timeout={timeout}>
                {message}
              </SuccessToast>
            );
          }
          case 'neutral': {
            return (
              <NeutralToast key={id} timeout={timeout}>
                {message}
              </NeutralToast>
            );
          }
          default: {
            return <span />;
          }
        }
      })}
    </Container>
  );
};

const mapStateToProps = (state): Object => ({
  toasts: state.toasts.toasts,
});
export default connect(mapStateToProps)(ToastsPure);
