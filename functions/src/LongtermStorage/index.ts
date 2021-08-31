import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DialogflowCXConversation } from '../DialogflowCX/Conv';
import { WebhookRequest } from '../DialogflowCX/WebhookRequest';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore().collection('DialogflowCXLongtermStorage');

export const longtermstorage = functions.https.onRequest(async (req, res) => {
  const conv = new DialogflowCXConversation(req.body as WebhookRequest);
  const userId = conv.sessionId.match(/.*\/(.*)$/)![1];
  const userDoc = db.doc(userId);
  switch (conv.tag) {
    case 'save': {
      if (conv.sessionParameters.storage) await userDoc.set({ storage: conv.sessionParameters.storage });
      break;
    }
    case 'load': {
      const data = (await userDoc.get()).data();
      conv.sessionParameters.storage = data?.storage ? data.storage : {};
      break;
    }
    case 'clear': {
      conv.sessionParameters.storage = {};
      await userDoc.delete();
      break;
    }
    default: {
      break;
    }
  }
  res.json(conv.serialize());
});
