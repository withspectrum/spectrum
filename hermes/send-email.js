// @flow
import { Client } from 'postmark';
const debug = require('debug')('hermes:send-email');

let sendEmailWithTemplate;
if (process.env.POSTMARK_SERVER_KEY) {
  const client = new Client(process.env.POSTMARK_SERVER_KEY);
  sendEmailWithTemplate = client.sendEmailWithTemplate;
} else {
  console.log('\nℹ️ No Postmark server key provided, not sending any mails.');
  // If no postmark API key is provided don't crash the server but log instead
  sendEmailWithTemplate = ({ To }, cb) => {
    debug(`pretending to send email with postmark to ${To}`);
    cb();
  };
}

type Options = {
  TemplateId: number,
  To: string,
  TemplateModel?: Object,
};

const sendEmail = (options: Options) => {
  const { TemplateId, To, TemplateModel } = options;
  debug(`to ${To} with template ${TemplateId}`);
  return new Promise((res, rej) => {
    sendEmailWithTemplate(
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
