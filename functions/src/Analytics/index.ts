import * as functions from 'firebase-functions';
import * as request from 'request';
import * as urlencode from 'urlencode';
import { DialogflowCXConversation } from '../DialogflowCX/Conv';
import { WebhookRequest } from '../DialogflowCX/WebhookRequest';

const GOOGLE_ANALYTICS_URL = 'https://www.google-analytics.com/collect';
const VERSION = 'v';
const TRACKING_ID = 'tid';
const CLIENT_ID = 'cid';
const HIT_TYPE = 't';
const EVENT = 'event';
const EVENT_CATEGORY = 'ec';
const EVENT_ACTION = 'ea';
const EVENT_LABEL = 'el';
const trackEvent = (trackingId: string, userId: string, event: string, value: string, label: string) => {
  const options = {
    // eslint-disable-next-line max-len
    body: `${VERSION}=1&${TRACKING_ID}=${trackingId}&${CLIENT_ID}=${userId}&${HIT_TYPE}=${EVENT}&${EVENT_CATEGORY}=${urlencode(
      event,
    )}&${EVENT_ACTION}=${urlencode(value)}&${EVENT_LABEL}=${urlencode(label)}`,
    url: GOOGLE_ANALYTICS_URL,
    json: false,
  };

  request.post(options, (error, response) => {
    if (error) {
      console.error(`post: ${error}`);
      return;
    }
    console.log(`analytics response: ${response.statusCode}`);
  });
};

export const analytics = functions.https.onRequest((req, res) => {
  const { trackingid } = req.headers;
  if (!trackingid) throw new Error('No trackingId added in authorization headers');
  const conv = new DialogflowCXConversation(req.body as WebhookRequest);
  const parsedTag = JSON.parse(conv.tag);
  const event = parsedTag.event || conv.sessionParameters.event;
  const category = parsedTag.category || conv.sessionParameters.category;
  const label = parsedTag.label || conv.sessionParameters.label;
  const sessionId = conv.sessionId.match(/.*\/(.*)$/)![1];

  trackEvent(trackingid as string, sessionId, event, category, label);

  res.sendStatus(200);
});
