export interface UserInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  token: string;
}
