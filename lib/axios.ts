import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXTAUTH_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
