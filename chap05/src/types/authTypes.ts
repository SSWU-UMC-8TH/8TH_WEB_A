// src/types/authTypes.ts

export type RequestSignupDto = {
  email: string;
  password: string;
  name: string; 
};

export type ResponseSignupDto = {
  id: number;
  name: string;
  email: string;
};

export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = {
  access_token: string;
  refresh_token: string;
};

export type ResponseMyInfoDto = {
  id: number;
  name: string;
  email: string;
  avatar?: string; 

};
