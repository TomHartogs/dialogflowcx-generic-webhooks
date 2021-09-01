export interface PageInfo {
  formInfo?: string;
}
export interface Payload {
  [key: string]: unknown;
}
export interface SessionInfo {
  parameters?: { [key: string]: unknown };
}
export interface Text {
  text: string[];
}
export interface textMessage {
  text: Text;
}
export interface payloadMessage {
  payload: object;
}
export interface conversationSuccessMessage {
  conversationSuccess: ConversationSuccess;
}
export interface outputAudioTextMessage {
  OutputAudioText: OutputAudioText;
}
export interface liveAgentHandoffMessage {
  liveAgentHandoff: LiveAgentHandoff;
}
export interface endInteractionMessage {
  endInteraction: boolean;
}
export interface playAudioMessage {
  playAudio: PlayAudio;
}
export interface mixedAudioMessage {
  mixedAudio: MixedAudio;
}
export type ResponseMessage =
  | textMessage
  | payloadMessage
  | conversationSuccessMessage
  | outputAudioTextMessage
  | liveAgentHandoffMessage
  | endInteractionMessage
  | playAudioMessage
  | mixedAudioMessage;

export interface ConversationSuccess {
  metadata: Record<string, unknown>;
}
export interface OutputAudioText {
  text: string;
  ssml: string;
}
export interface LiveAgentHandoff {
  metadata: Record<string, unknown>;
}
export interface PlayAudio {
  // eslint-disable-next-line camelcase
  audio_uri: string;
}
// TODO Still needs to be defined better
export interface MixedAudio {
  [key: string]: unknown;
}
export interface SentimentAnalysisResult {
  score: number;
  magnitutde: number;
}
export interface Parameters {
  [parameter: string]: unknown;
}
