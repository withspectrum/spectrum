// @flow
/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 *
 * Note: This uses Flow comment syntax so this whole file is actually valid JS without any transpilation
 * The reason I did that is because create-react-app doesn't transpile files outside the source folder,
 * so it chokes on the Flow syntax.
 * More info: https://flow.org/en/docs/types/comments/
 */
var slate = require('./slate-utils');
var truncate = require('./truncate');
var { sanitize } = require('sanitizer');

var DEFAULT_META = {
  title: 'Spectrum',
  description: 'Where communities live.',
};

/*::
type MaybeMeta = {
  title?: string,
  description?: string,
};

type Meta = {
  title: string,
  description: string,
};

type OtherInput = {
  type?: string,
  data?: void,
};
type ThreadInput = {
  type: 'thread',
  data?: { title: string, body?: ?string, channelName?: string, type?: ?string },
};
type UserInput = {
  type: 'user',
  data?: { name: string, username: string, description?: string },
};
type ChannelInput = {
  type: 'channel',
  data?: { name: string, description?: string, communityName?: string },
};
type CommunityInput = {
  type: 'community',
  data?: { name: string, description?: string },
};
type Input =
  | ThreadInput
  | UserInput
  | ChannelInput
  | CommunityInput
  | OtherInput;
*/

function setDefault(input /*: MaybeMeta */) /*: Meta */ {
  var title = input.title || DEFAULT_META.title;
  var description = input.description || DEFAULT_META.description;
  // If theres a custom title but no custom description
  // prefix "On spectrum" to the description
  // Otherwise you end up with "SpecFM | Where communities live"
  if (input.title && !input.description) {
    description = 'on Spectrum, ' + DEFAULT_META.description.toLowerCase();
  }
  return { title: title, description: cleanDescription(description) };
}

function cleanDescription(input /*: string */) /*: string */ {
  return truncate(sanitize(input), 160);
}

function generateMetaInfo(input /*: Input */) /*: Meta */ {
  var exists = input || {};
  var type = exists.type;
  var data = exists.data;
  switch (type) {
    case 'explore': {
      return {
        title: 'Explore · Spectrum',
        description: 'Explore some of the communities on Spectrum',
      };
    }
    case 'thread': {
      return setDefault({
        title: data && data.title + ' · ' + data.channelName,
        description: data &&
          data.body &&
          (data.type === 'SLATE'
            ? slate.toPlainText(slate.toState(JSON.parse(data.body)))
            : data.body),
      });
    }
    case 'user': {
      return setDefault({
        title: data && data.name + ' (@' + data.username + ')',
        description: data && data.description,
      });
    }
    case 'channel': {
      return setDefault({
        title: data && data.name + ' · ' + data.communityName,
        description: data && data.description,
      });
    }
    case 'community': {
      return setDefault({
        title: data && data.name,
        description: data && data.description,
      });
    }
    default: {
      return DEFAULT_META;
    }
  }
}

module.exports = generateMetaInfo;
