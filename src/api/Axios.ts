import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Axios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default Axios;
