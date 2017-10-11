import postmark from 'postmark';
const debug = require('debug')('hermes:send-email');
const stringify = require('json-stringify-pretty-compact');

let client;
if (process.env.POSTMARK_SERVER_KEY) {
  client = new postmark.Client(process.env.POSTMARK_SERVER_KEY);
} else {
  console.log(
    '\nℹ️ POSTMARK_SERVER_KEY not provided, debug mode enabled. Will log emails instead of actually sending them.'
  );
  // If no postmark API key is provided don't crash the server but log instead
  client = {
    sendEmailWithTemplate: ({ To, TemplateModel }, cb) => {
      debug('debug mode enabled, mocking email sending');
      cb();
    },
  };
}

type Options = {
  TemplateId: number,
  To: string,
  TemplateModel?: Object,
};

const sendEmail = (options: Options) => {
  const { TemplateId, To, TemplateModel } = options;
  debug(
    `--Send email with template ${TemplateId}--\nTo: ${To}\nRe: ${TemplateModel.subject}\nTemplateModel: ${stringify(
      TemplateModel
    )}`
  );
  return new Promise((res, rej) => {
    client.sendEmailWithTemplate(
      {
        From: 'hi@spectrum.chat',
        TemplateId: TemplateId,
        To: To,
        TemplateModel: TemplateModel,
      },
      err => {
        if (err) {
          console.log('Error sending email:');
          console.log(err);
          return rej(err);
        }
        res();
        debug(`email to ${To} sent successfully`);
      }
    );
  });
};

export default sendEmail;
