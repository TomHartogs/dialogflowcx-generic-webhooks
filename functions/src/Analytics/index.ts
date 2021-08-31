import * as functions from 'firebase-functions';
import * as request from 'request';
export const analytics = functions.https.onRequest((req, res) => {

  res.sendStatus(200);
});
