// @flow
import isEmail from 'validator/lib/isEmail';
import postmark from 'postmark';
const debug = require('debug')('hermes:send-email');
const stringify = require('json-stringify-pretty-compact');
import { deactivateUserEmailNotifications } from './models/usersSettings';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

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
  userId?: string,
};

const sendEmail = (options: Options) => {
  const { TemplateId, To, TemplateModel, Tag, userId } = options;
  debug(
    `--Send email with template ${TemplateId}--\nTo: ${To}\nRe: ${
      TemplateModel.subject
    }\nTemplateModel: ${stringify(TemplateModel)}`
  );

  if (userId) {
    trackQueue.add({
      userId: userId,
      event: events.EMAIL_RECEIVED,
      properties: { tag: Tag },
    });
  }

  if (!To) {
    if (userId) {
      trackQueue.add({
        userId: userId,
        event: events.EMAIL_BOUNCED,
        properties: { tag: Tag, error: 'To field was not provided' },
      });
    }

    return;
  }

  if (!isEmail(To)) {
    if (userId) {
      trackQueue.add({
        userId: userId,
        event: events.EMAIL_BOUNCED,
        // we can safely log the To field because it's not a valid email, thus not PII
        properties: {
          tag: Tag,
          to: To,
          error: 'To field was not a valid email address',
        },
      });
    }

    return;
  }

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
          // 406 means the user became inactive, either by having an email
          // hard bounce or they marked as spam
          if (err.code === 406) {
            if (userId) {
              trackQueue.add({
                userId: userId,
                event: events.EMAIL_BOUNCED,
                properties: { tag: Tag, error: err.message },
              });
            }

            return await deactivateUserEmailNotifications(To)
              .then(() => rej(err))
              .catch(e => rej(e));
          }

          if (err.code === 422) {
            if (userId) {
              trackQueue.add({
                userId: userId,
                event: events.EMAIL_BOUNCED,
                // we can safely log the To field as error 422 means the To field is malformed anyways and is not a valid email address
                properties: { tag: Tag, error: err.message, to: To },
              });
            }
          }

          console.error('Error sending email:');
          console.error(err);
          return rej(err);
        }
        res();
        debug(`email to ${To} sent successfully`);
      }
    );
  });
};

export default sendEmail;
