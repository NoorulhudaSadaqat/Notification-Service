import { ISignUp, ILogin } from "../types/auth";
import APIClient from "./axios";

export const signUpService = async (data: ISignUp) => {
  try {
    const res = await APIClient("/auth/signup", "post", data);
    if (res) return res.data;
  } catch (err) {
    return err;
  }
};

export const loginService = async (data: ILogin) => {
  try {
    const res = await APIClient("/auth/login", "post", data);
    if (res) return res.data;
  } catch (err) {
    return err;
  }
};
