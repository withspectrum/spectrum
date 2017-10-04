function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

class WebPushManager {
  manager: any;
  subscriptionAttempt: boolean;

  constructor() {
    this.manager = null;
    this.subscriptionAttempt = false;
  }

  set = manager => {
    this.manager = manager;
    if (this.subscriptionAttempt) {
      this.subscribe();
    } else if (this.unsubscriptionAttempt) {
      this.unsubscribe();
    }
  };

  subscribe = () => {
    if (!this.manager) {
      this.subscriptionAttempt = true;
      return Promise.reject('Please try again.');
    }
    return this.manager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        'BPJAFt0MO2BkTYSuzNdGHbVD6lbk2bzYqMBp1gBXLKUupEIIV7yXViZ1D7SyrJfFbYkKuoxwyaP8YcHU8nRDQsA'
      ),
    });
  };

  unsubscribe = () => {
    if (!this.manager) {
      this.unsubscriptionAttempt = true;
      return Promise.resolve(true);
    }
    return this.getSubscription().then(subscription =>
      subscription.unsubscribe()
    );
  };

  getPermissionState = () => {
    // No compat
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return new Promise(res => {
        res(false);
      });
    }
    // Old API
    if (navigator.permissions) {
      return navigator.permissions
        .query({ name: 'notifications' })
        .then(result => result.state);
    }
    // New API
    return new Promise(res => {
      res(Notification.permission);
    });
  };

  _getSubscription = () => {
    return this.manager.getSubscription();
  };

  getSubscription = () =>
    new Promise(res => {
      // Recursively call this method until we got a manager
      if (!this.manager) {
        setTimeout(() => {
          res(this.getSubscription());
        }, 500);
      } else {
        res(this._getSubscription());
      }
    });
}

export default new WebPushManager();
