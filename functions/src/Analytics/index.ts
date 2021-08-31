import * as functions from 'firebase-functions';
import * as request from 'request';
import * as urlencode from 'urlencode';
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

  res.sendStatus(200);
});
