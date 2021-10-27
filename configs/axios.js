import axios from "axios";
import config from "./index";

const api = axios.create({
  baseURL: config.url,
});

export default api;
