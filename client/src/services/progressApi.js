import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/user",
  withCredentials: true
});

export const updateActivity = () => API.post("/update-activity");

export const updateWatchTime = (data) => API.post("/update-watchtime", data);

export const getUserProgress = (userId) =>
  API.get(`/progress/${userId}`);
