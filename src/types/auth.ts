export type Role = 'owner' | 'customer';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  tenantId: number | null;
}

export interface TokenPair extends SessionUser {
  accessToken: string;
  refreshToken: string;
}

export type LoginApiResponse =
  | TokenPair
  | { twoFactorRequired: true; preAuthToken: string };
