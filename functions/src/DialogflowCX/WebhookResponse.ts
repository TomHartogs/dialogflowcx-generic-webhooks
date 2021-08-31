import { PageInfo, ResponseMessage, SessionInfo } from './Common';

interface BaseWebhookResponse {
  fulfillmentResponse?: FulfillmentResponse;
  pageInfo?: PageInfo;
  sessionInfo?: SessionInfo;
  payload?: Record<string, unknown>;
}

export interface TargetPageWebhookResponse extends BaseWebhookResponse {
  targetPage?: string;
  // projects/<Project ID>/locations/<Location ID>/agents/<Agent ID>/flows/<Flow ID>/pages/<Page ID>
}
export interface TargetFlowWebhookResponse extends BaseWebhookResponse {
  targetFlow?: string;
  // projects/<Project ID>/locations/<Location ID>/agents/<Agent ID>/flows/<Flow ID>
}
export type WebhookResponse = TargetPageWebhookResponse | TargetFlowWebhookResponse;

export interface FulfillmentResponse {
  messages: ResponseMessage[];
  mergeBehavior?: MergeBehavior;
}

export enum MergeBehavior {
  MERGE_BEHAVIOUR_UNSPECIFIED,
  APPEND,
  REPLACE,
}
