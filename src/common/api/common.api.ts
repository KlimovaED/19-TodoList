import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "99278ac3-b7e2-4fe8-a1c0-e1497288437b",
  },
});
