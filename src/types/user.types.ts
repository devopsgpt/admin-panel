export interface User {
  app_metadata: { provider: 'github' | 'google' };
  user_metadata: { avatar_url: 'string'; user_name: string };
}
