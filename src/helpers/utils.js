import * as firebase from 'firebase';
import React from 'react';
import LoadingIndicator from '../shared/loading/global';
import createEmojiRegex from 'emoji-regex';

export const hashToArray = hash => {
  let array = [];
  for (let key in hash) {
    if (!hash.hasOwnProperty(key)) continue;
    let arr = hash[key];
    array.push(arr);
  }
  return array;
};

export const sortAndGroupBubbles = messages => {
  if (!messages.length > 0) return [];

  let masterArray = [];
  let newArray = [];
  let checkId;

  for (let i = 0; i < messages.length; i++) {
    if (i === 0) {
      checkId = messages[i].userId;
    }

    if (messages[i].userId === checkId) {
      // this message user id does match
      newArray.push(messages[i]);
      checkId = messages[i].userId;
    } else {
      // this message user id doesn't match
      masterArray.push(newArray);

      // reset
      checkId = messages[i].userId;
      newArray = [];
      newArray.push(messages[i]);
    }
  }
  masterArray.push(newArray);
  return masterArray;
};

const fetch = (ref, orderBy, equalTo) => {
  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(ref)
      .orderByChild(orderBy)
      .equalTo(equalTo)
      .once('value', snapshot => {
        let val = snapshot.val();

        if (ref === 'stories') {
          resolve(val);
        } else if (ref === 'frequencies') {
          let obj = val[equalTo];
          resolve(obj);
        }
      });
  });
};

const fetchDataByIds = (obj, params) => {
  let keys = Object.keys(obj);
  return Promise.all(keys.map(key => fetch(...params, key)));
};

export const fetchFrequenciesForUser = frequencies => {
  return fetchDataByIds(frequencies, ['frequencies', 'id']);
};

export const fetchStoriesForFrequencies = frequencies => {
  return fetchDataByIds(frequencies, ['stories', 'frequency']);
};

export const asyncComponent = getComponent => {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
    }
    render() {
      const { Component } = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return <LoadingIndicator />;
    }
  };
};

export const checkUniqueFrequencyName = name => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('frequencies')
      .orderByChild('slug')
      .equalTo(name)
      .once('value')
      .then(snapshot => {
        let val = snapshot.val();
        if (!val) return resolve(true); // if a frequency with this slug doesn't exist, it's okay to use the new name
        if (val.id === name) return resolve(true); // and if we're looking at the current frequency (i.e. changing the slug after creation), it's okay
        return resolve(false); // otherwise we can assume the slug is taken
      });
  });
};

export const debounce = (func, wait, immediate) => {
  let timeout;
  return () => {
    let context = this, args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();
// Make sure we match strings that only contain emojis (and whitespace)
const regex = new RegExp(
  `^(${originalEmojiRegex.toString().replace(/\/g$/, '')}|\\s)+$`,
);

export const onlyContainsEmoji = text => regex.test(text);

export const sortArrayByKey = (array, key) => {
  return array.sort((a, b) => {
    let x = a[key];
    let y = b[key];

    return x < y ? -1 : x > y ? 1 : 0;
  });
};
