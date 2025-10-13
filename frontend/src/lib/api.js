import axios from "axios";
import { axiosInstance } from "./axios";


export const signup = async (signupData)=>{
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
};

export const login = async (loginData)=>{
    const response = await axiosInstance.post("/auth/login" , loginData);
    return response.data;
}

export const logout = async ()=>{
    const response = await axiosInstance.post("/auth/logout" );
    return response.data;
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      return null; // user not authenticated
    }
    throw err; // rethrow for other errors
  }
};


export const completeOnboarding = async (userData)=>{
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}