import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const signupApi = async (payload: { email: string; password: string; }) => {
  try {
    const response = await apiInstance.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("Signup API call failed", error);
    throw error;
  }
};


export const loginApi = async (payload: { username: string; password: string; }) => {
  try {
    const response = await apiInstance.post("/token", payload);
    return response;
  } catch (error) {
    console.error("Login API call failed", error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await apiInstance.post("/VerifyToken", {},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Token verification failed", error);
    throw error;
  }
};

export const refreshToken = async (token: string) => {
  try {
    const response = await apiInstance.post("/refresh", {},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Token verification failed", error);
    throw error;
  }
};
