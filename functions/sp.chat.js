const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({ origin: true });

const app = express();

// Redirect to root page
const toRoot = res => res.redirect('https://spectrum.chat');
// Create redirect link
const createLink = ({ story, frequency, title, description }) =>
  `https://spectrum.chat/~${frequency}${story
    ? `/${story}`
    : ''}?t=${encodeURIComponent(title)}&d=${encodeURIComponent(
    description ? description.substr(0, 140) : '',
  )}`;
// Truncate a string nicely to a certain length
const truncate = (str, length) => {
  if (str.length <= length) {
    return str;
  }
  const subString = str.substr(0, length);
  return subString.substr(0, subString.lastIndexOf(' ')) + '…';
};

app.get('/~:frequency', (req, res) => {
  cors(req, res, () => {
    const { frequency } = req.params;
    if (!frequency) return toRoot(res);
    if (frequency === 'everything')
      return res.redirect('https://spectrum.chat');
    return admin
      .database()
      .ref('frequencies')
      .orderByChild('slug')
      .equalTo(frequency)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(data => {
        if (!data) return toRoot(res);
        const { name, description } = data[Object.keys(data)[0]];
        return res.redirect(
          createLink({
            frequency,
            title: `~${name}`,
            description: truncate(description, 150),
          }),
        );
      });
  });
});

app.get('/:storyId', (req, res) => {
  cors(req, res, () => {
    const { storyId } = req.params;
    if (!storyId) return toRoot(res);
    return admin
      .database()
      .ref(`stories/${storyId}`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then(story => {
        if (!story || story.deleted) return toRoot(res);
        return Promise.all([
          story,
          admin
            .database()
            .ref(`frequencies/${story.frequencyId}`)
            .once('value')
            .then(snapshot => snapshot.val()),
        ]);
      })
      .then(([story, frequency]) => {
        if (!frequency || frequency.deleted) return toRoot(res);
        res.redirect(
          createLink({
            frequency: frequency.slug,
            title: truncate(story.content.title, 40),
            description: truncate(story.content.description, 150),
            story: storyId,
          }),
        );
      });
  });
});

module.exports = functions.https.onRequest(app);
