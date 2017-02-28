import * as firebase from 'firebase';
import { hashToArray } from '../helpers/utils';
import { track } from '../EventTracker';

export const getFile = (file, story) => {
  return new Promise((resolve, reject) => {
    if (!file) return;

    let storageRef = firebase.storage().ref();
    let fileRef = storageRef.child(`/stories/${story}/${file}`);
    fileRef.getDownloadURL().then(url => {
      resolve(url);
    });
  });
};

export const getStorageUrlsFromArr = (arr, story) => {
  return Promise.all(arr.map(file => getFile(file, story)));
};

/*------------------------------------------------------------\*
*

Gallery
Accepts an array of URLs which will be parsed and populated in the gallery component.

*
\*------------------------------------------------------------*/
export const openGallery = e => (dispatch, getState) => {
  dispatch({ type: 'LOADING' });
  let state = getState();
  let src = e.target.src;
  src = src.toString();
  let activeStory = state.stories.active;

  track('gallery', 'opened', null);

  firebase
    .database()
    .ref(`stories/${activeStory}/media`)
    .once('value', snapshot => {
      let val = snapshot.val();
      let arr = hashToArray(val);
      let urlArr = arr.slice().map((img, i) => img.fileName); //=> convert hash to array of filename urls
      let checkForMatch = urlArr.filter(url => {
        let match = url.toString();
        match = encodeURI(match);
        let re = new RegExp(match, 'g');
        let itMatches = src.match(re);
        return itMatches;
      });

      let matchToIndex = checkForMatch[0];
      let index = urlArr.indexOf(matchToIndex);

      getStorageUrlsFromArr(urlArr, activeStory).then(arr => {
        dispatch({
          type: 'SHOW_GALLERY',
          isOpen: true,
          media: arr,
          index: index ? index : 0, // i
        });
      });
    });
};

export const closeGallery = () => {
  track('gallery', 'closed', null);

  return {
    type: 'HIDE_GALLERY',
  };
};
