// @flow
import React from 'react';
// $FlowFixMe
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
            return (
              <ErrorToast key={id} timeout={timeout}>
                {message}
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

const mapStateToProps = state => ({
  toasts: state.toasts.toasts,
});
export default connect(mapStateToProps)(ToastsPure);
