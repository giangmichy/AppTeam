import axiosInstance from "../lib/axios";

export const login = async (data: { username: string; password: string }) => {
  return axiosInstance.post("/auth/login", data);
};

export const register = async (data: {
  username: string;
  password: string;
  email: string;
}) => {
  return axiosInstance.post("/auth/register", data);
};
