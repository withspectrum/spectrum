// @flow
import isEmail from 'validator/lib/isEmail';
import sg from '@sendgrid/mail';
import fs from 'fs';
const debug = require('debug')('hermes:send-email');
const stringify = require('json-stringify-pretty-compact');
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
const { SENDGRID_API_KEY } = process.env;

type Options = {
  templateId: string,
  to: string,
  dynamic_template_data: Object,
  userId?: string,
};

const defaultOptions = {
  from: {
    email: 'hi@spectrum.chat',
    name: 'Spectrum',
  },
  tracking_settings: {
    click_tracking: {
      enable: false,
    },
  },
};

const sendEmail = (options: Options): Promise<void> => {
  const { templateId, to, dynamic_template_data, userId } = options;

  if (SENDGRID_API_KEY !== 'undefined') {
    debug(
      `--Send LIVE email with templateId ${templateId}--\nto: ${to}\ndynamic_template_data: ${stringify(
        dynamic_template_data
      )}`
    );
    sg.setApiKey(SENDGRID_API_KEY);
  } else {
    debug(`--Send TEST email with templateId ${templateId}--\n--to: ${to}--`);

    // eslint-disable-next-line
    debug(
      stringify({
        templateId,
        to,
        dynamic_template_data,
        userId,
      })
    );

    return Promise.resolve();
  }

  if (userId) {
    trackQueue.add({
      userId: userId,
      event: events.EMAIL_RECEIVED,
    });
  }

  if (!to) {
    if (userId) {
      trackQueue.add({
        userId: userId,
        event: events.EMAIL_BOUNCED,
        properties: { error: 'To field was not provided' },
      });
    }

    return Promise.resolve();
  }

  // qq.com email addresses are isp blocked, which raises our error rate
  // on sendgrid. prevent sending these emails at all
  if (to.substr(to.length - 7) === '@qq.com') {
    return Promise.resolve();
  }

  return sg.send({
    ...defaultOptions,
    templateId,
    to,
    dynamic_template_data,
  });
};

export default sendEmail;
