export interface ChatResponse {
  response: string;
}

export interface Chats {
  role: string;
  content: string;
  loading?: boolean;
}
