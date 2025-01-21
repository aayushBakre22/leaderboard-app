import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:3000/api/v1/users",
  baseURL: "https://leaderboard-app-oqvs.onrender.com/api/v1/users",
  timeout: 3000,
});
export default instance;
