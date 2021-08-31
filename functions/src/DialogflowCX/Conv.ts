//import * as Api from './api/v3';
import {
  WebhookRequest,
  IntentParameter,
} from './WebhookRequest';
import {
    WebhookResponse,
    MergeBehavior,
    TargetPageWebhookResponse,
    TargetFlowWebhookResponse,
} from './WebhookResponse'
import {     Parameters,
    ResponseMessage
    }
     from './Common'

function isResponseMessage(message: object): message is ResponseMessage {
    return (
      'text' in message ||
      'payload' in message ||
      'conversationSuccess' in message ||
      'liveAgentHandoff' in message ||
      'endInteraction' in message ||
      'playAudio' in message ||
      'mixedAudio' in message
    );
  }
  

export class DialogflowCXConversation {
  private _raw?: Record<string, unknown>;
  private _transitionPage?: string;
  private _transitionFlow?: string;
  private _currentPage: string;
  private _digested = false;
  private _transitionSet = false;

  public request: WebhookRequest;
  public responseMessages: ResponseMessage[] = [];
  public input: string;
  public sessionId: string;
  public tag: string;
  public intent?: string;
  public readonly intentParameters: IntentParameter;
  public sessionParameters: Parameters;
  public detectIntentResponseId: string;

  constructor(request: WebhookRequest) {
    this.request = request;
    const { fulfillmentInfo, intentInfo, pageInfo, sessionInfo, messages, detectIntentResponseId } = request;
    this.tag = fulfillmentInfo.tag;
    this.intent = intentInfo?.displayName;
    this.intentParameters = intentInfo?.parameters || {};
    this.sessionParameters = sessionInfo.parameters || {};
    this.responseMessages.push(...messages);
    this.input = intentInfo?.lastMatchedIntent || '';
    this.sessionId = sessionInfo.session;
    this._currentPage = pageInfo.currentPage;
    this.detectIntentResponseId = detectIntentResponseId;
  }

  add(...messages: (string | ResponseMessage | object)[]) {
    if (this._digested) {
      throw new Error(
        'Response has already been sent. ' +
          'Is this being used in an async call that was not ' +
          'returned as a promise to the intent handler?',
      );
    }

    for (const message of messages) {
      if (typeof message === 'string') {
        this.responseMessages.push({
            text: {
                text: [message]
            }
        });
      } else if (isResponseMessage(message)) {
        this.responseMessages.push(message);
      } else {
        this.responseMessages.push({
          payload: message,
        });
      }
    }
  }

  close(...messages: (string | ResponseMessage | object)[]) {
    this.add(...messages);
    this.add({ conversationSuccess: {} });
  }

  clear() {
    this.responseMessages = [];
  }

  transitionPage(pageId: string) {
    if (this._transitionSet) {
      throw new Error('Transition has already been set');
    }
    this._transitionSet = true;
    this._transitionPage = this._currentPage.replace(/(.*pages\/).*/gi, `$1${pageId}`);
  }

  transitionFlow(flowId: string) {
    if (this._transitionSet) {
      throw new Error('Transition has already been set');
    }
    this._transitionSet = true;
    this._transitionFlow = this._currentPage.replace(/(.*flows\/).*/gi, `$1${flowId}`);
  }

  json(json: Record<string, unknown>){
    this._raw = json;
    return this;
  }

  /** @public */
  serialize(): WebhookResponse {
    if (this._raw) {
      return this._raw;
    }
    if (this._digested) {
      throw new Error('Response has already been digested');
    }
    this._digested = true;

    const response: WebhookResponse = {
      fulfillmentResponse: {
        messages: this.responseMessages,
        mergeBehavior: MergeBehavior.REPLACE,
      },
      sessionInfo: {
        parameters: this.sessionParameters,
      },
    };

    if (this._transitionPage) {
      (response as TargetPageWebhookResponse).targetPage = this._transitionPage;
    } else if (this._transitionFlow) {
      (response as TargetFlowWebhookResponse).targetFlow = this._transitionFlow;
    }
    return response;
  }
}
