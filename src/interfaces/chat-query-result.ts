import Message from './message';

export default interface ChatQueryResult {
  chat_name: string;
  member_tokens: Array<string>;
  message: Message;
}
