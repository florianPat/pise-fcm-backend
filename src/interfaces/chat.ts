import Message from './message';

export default interface Chat {
  chat_name: string; // null for two-person-chats
  member_uids: Array<string>;
  messages: Record<string, Message>;
}
