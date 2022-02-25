import MessageQueryResult from './message-query-result';

export default interface ChatQueryResult {
  chat_name: string;
  member_tokens: Array<string>;
  message: MessageQueryResult;
}
