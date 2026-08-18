export interface IGithubTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  token_type: string; //bearer
  scope: string; //read:user, user:email
}

export interface IGithubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
}

export interface IGithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}
