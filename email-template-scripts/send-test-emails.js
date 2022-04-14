// @flow
require('now-env');
const fetch = require('isomorphic-fetch');
const { SENDGRID_API_KEY } = process.env;
const processArgs = process.argv.slice(2);
const TO = processArgs.find(arg => arg.indexOf('@') > 0);
const sg = require('@sendgrid/mail');

if (!TO) {
  console.error('❌ Be sure to provide a valid email');
  return;
}

if (!SENDGRID_API_KEY) {
  console.error('❌ Be sure to provide a SendGrid API key');
  return;
}

sg.setApiKey(SENDGRID_API_KEY);

const sendEmail = (templateId, dynamic_template_data) => {
  return sg.send({
    from: {
      email: 'hi@spectrum.chat',
      name: 'Spectrum',
    },
    tracking_settings: {
      click_tracking: {
        enable: false,
      },
    },
    templateId,
    to: TO,
    dynamic_template_data,
  });
};

const init = () => {
  const templates = [
    {
      filename: 'message-in-threads',
      id: 'd-7a4c14fd440146f1b1cfcafb633bb040',
    },
    { filename: 'mention-in-thread', id: 'd-ff421ea0112a4525b6615bcc666ede00' },
    {
      filename: 'mention-in-message',
      id: 'd-637189bc871744e9846694bff9f572ae',
    },
    {
      filename: 'direct-message-received',
      id: 'd-3e289af9efe748308be2dde1d3786c0d',
    },
    { filename: 'new-user-welcome', id: 'd-2e46e5b65abc42b78941fbe027be4cd5' },
    {
      filename: 'community-invitation',
      id: 'd-69b2e17b7a0f46048dcf4083ad4f9c48',
    },
    { filename: 'community-created', id: 'd-dc7b4f048f4c460f9dd368fd3796421b' },
    { filename: 'thread-created', id: 'd-084c11332981443388ebdae05d0a2ff4' },
    { filename: 'digest', id: 'd-5e52250c25be4654af82172970551919' },
    {
      filename: 'user-email-validation',
      id: 'd-9fbb3cc969364050aac891c255d31209',
    },
    {
      filename: 'community-admin-email-validation',
      id: 'd-a60e1df2d5294c73818759be13f09df4',
    },
    {
      filename: 'private-community-request-approved',
      id: 'd-d91de18c257344d2bf9ff0c628d1a92e',
    },
    {
      filename: 'private-community-request-sent',
      id: 'd-743d07e016ee4798a87c06b5dd0a27a1',
    },
    {
      filename: 'private-channel-request-approved',
      id: 'd-6bc3fffa3fa64e369035bc906b3975dd',
    },
    {
      filename: 'private-channel-request-sent',
      id: 'd-29f3f62815004e0bb3b9f884c9fb3901',
    },
    {
      filename: 'admin-user-reported-alert',
      id: 'd-7340d2f62edd4af6a4c95f87a8d4e1c6',
    },
    {
      filename: 'admin-user-spamming-threads-alert',
      id: 'd-65de04a810d84af7b76a57f7b4b6ebbe',
    },
    {
      filename: 'admin-active-community-report',
      id: 'd-82812e47e2ea458c8ded5be8d3de4f48',
    },
    {
      filename: 'admin-slack-import-completed',
      id: 'd-b3f8d36ef3354ce987a352ce39893432',
    },
    {
      filename: 'admin-toxic-content',
      id: 'd-f6e52c81dd8d49e29f23c5c6112d676b',
    },
    {
      filename: 'admin-community-created-notification',
      id: 'd-8220ddfc3d3a436a9ea974348c9c2edd',
    },
  ];

  return templates.map(template => {
    const json = require(`./test-email-data/${template.filename}`);
    console.error(`✅ Sending test email for ${template.filename}`);
    return sendEmail(template.id, json);
  });
};

init();
