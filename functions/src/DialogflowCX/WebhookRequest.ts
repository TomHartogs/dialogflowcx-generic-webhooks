// eslint-disable-next-line max-len
import { PageInfo, ResponseMessage, SentimentAnalysisResult, SessionInfo } from './Common';

export interface WebhookRequest {
  detectIntentResponseId: string;
  fulfillmentInfo: FulfillmentInfo;
  intentInfo?: IntentInfo;
  pageInfo: RequestPageInfo;
  sessionInfo: RequestSessionInfo;
  messages: ResponseMessage[];
  payload: Record<string, unknown>;
  sentimentAnalysisResult: SentimentAnalysisResult;
}
export interface FulfillmentInfo {
  tag: string;
}

export interface IntentParameterValue {
  originalValue: string;
  resolvedValue: string;
}
export interface IntentParameter {
  [key: string]: IntentParameterValue;
}
export interface IntentInfo {
  lastMatchedIntent: string;
  displayName: string;
  parameters?: IntentParameter;
  confidence: number;
}
export interface RequestPageInfo extends PageInfo {
  currentPage: string;
}
export interface RequestSessionInfo extends SessionInfo {
  session: string;
}
