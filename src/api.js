import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api/auth/login",
});

export default API;