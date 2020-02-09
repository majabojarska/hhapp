export interface User {
  id?: number;
  username: string;
  password: string;
  firstname: string;
  surname: string;
  color: string;
  dateOfBirth: string;
  isAdmin: boolean;
}

export interface UserDecorated extends User {
  fullname: string;
  initials: string;
  textColorClass: string;
}

export interface UserState {
  user?: User;
  access_token: string;
}

export interface TokenPayload {
  sub: number;
  username: string;
  isAdmin: boolean;
}
