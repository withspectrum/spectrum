// @flow
import { sendgridEventQueue } from 'shared/bull/queues';

// $FlowIssue
export default (req, res) => {
  const finished = () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end('okay');
  };

  let body = [];

  // $FlowIssue
  req.on('data', chunk => body.push(chunk));

  req.on('end', () => {
    // $FlowIssue
    body = Buffer.concat(body).toString();
    try {
      body = JSON.parse(body);
    } catch (err) {
      console.error(err.message);
      return finished();
    }

    if (!body || body.length === 0) {
      return finished();
    }

    body
      .filter(event => event && event.hasOwnProperty('status'))
      .filter(event => event.status === '5.0.0')
      .map(event => sendgridEventQueue.add({ event }));

    return finished();
  });
};
