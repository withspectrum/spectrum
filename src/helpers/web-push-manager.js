// @flow

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

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
    if (this.subscriptionAttempt) this.subscribe();
  };

  subscribe = () => {
    if (!this.manager) {
      this.subscriptionAttempt = true;
      return Promise.resolve({});
    }
    return this.manager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        'BPJAFt0MO2BkTYSuzNdGHbVD6lbk2bzYqMBp1gBXLKUupEIIV7yXViZ1D7SyrJfFbYkKuoxwyaP8YcHU8nRDQsA'
      ),
    });
  };

  getSubscription = () => this.manager.getSubscription();
}

export default new WebPushManager();
