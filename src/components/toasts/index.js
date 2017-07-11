// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
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
        const onClick =
          toast.action === 'refresh' &&
          (() => {
            window.location.reload(false);
          });
        switch (toast.kind) {
          case 'error': {
            return (
              <ErrorToast onClick={onClick} key={toast.id}>
                {toast.message}
              </ErrorToast>
            );
          }
          case 'success': {
            return (
              <SuccessToast onClick={onClick} key={toast.id}>
                {toast.message}
              </SuccessToast>
            );
          }
          case 'neutral': {
            return (
              <NeutralToast onClick={onClick} key={toast.id}>
                {toast.message}
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

const Toasts = compose(pure)(ToastsPure);
const mapStateToProps = state => ({
  toasts: state.toasts.toasts,
});
export default connect(mapStateToProps)(Toasts);
