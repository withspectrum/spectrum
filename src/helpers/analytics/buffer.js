// @flow
// Buffer Amplitude calls until its JavaScript is loaded

export const buffer = (fn: Function): (() => Promise<any>) => {
  let buffered = [];
  // Check whether Amplitude has loaded every second and sync buffered
  // calls once it's loaded
  let interval = setInterval(() => {
    if (!window.amplitude) return;
    clearInterval(interval);
    buffered.forEach(args => fn(...args));
  }, 1000);
  return (...args) => {
    // If Amplitude isn't loaded yet buffer the function call arguments
    if (!window.amplitude) {
      buffered.push(args);
      return Promise.resolve();
    }
    // Once Amplitude is loaded just call the wrapped function
    return fn(...args);
  };
};
