// @flow
import postmark from 'postmark';
const debug = require('debug')('hermes:send-email');
const stringify = require('json-stringify-pretty-compact');
import { deactiveUserEmailNotifications } from './models/usersSettings';

let client;
if (process.env.POSTMARK_SERVER_KEY) {
  client = new postmark.Client(process.env.POSTMARK_SERVER_KEY);
} else {
  debug(
    '\nℹ️ POSTMARK_SERVER_KEY not provided, debug mode enabled. Will log emails instead of actually sending them.'
  );
  // If no postmark API key is provided don't crash the server but log instead
  client = {
    sendEmailWithTemplate: ({ To, TemplateModel, Tag }, cb) => {
      debug('debug mode enabled, mocking email sending');
      cb();
    },
  };
}

type Options = {
  TemplateId: number,
  To: string,
  TemplateModel: Object,
  Tag: string,
};

const sendEmail = (options: Options) => {
  const { TemplateId, To, TemplateModel, Tag } = options;
  debug(
    `--Send email with template ${TemplateId}--\nTo: ${To}\nRe: ${
      TemplateModel.subject
    }\nTemplateModel: ${stringify(TemplateModel)}`
  );
  // $FlowFixMe
  return new Promise((res, rej) => {
    client.sendEmailWithTemplate(
      {
        From: 'hi@spectrum.chat',
        TemplateId: TemplateId,
        To: To,
        TemplateModel: TemplateModel,
        Tag: Tag,
      },
      async err => {
        if (err) {
          console.error('Error sending email:');
          console.error(err);

          // 406 means the user became inactive, either by having an email
          // hard bounce or they marked as as spam
          if (err.code === 406) {
            console.error(`Deactivating future notifications for ${To}`);
            return await deactiveUserEmailNotifications(To)
              .then(() => rej(err))
              .catch(e => rej(e));
          } else {
            return rej(err);
          }
        }
        res();
        debug(`email to ${To} sent successfully`);
      }
    );
  });
};

export default sendEmail;
