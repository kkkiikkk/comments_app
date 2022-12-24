export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  sessionId: string;
}

export interface JwtPayloadRefresh extends JwtPayload {
  refreshToken?: string;
}
