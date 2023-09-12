import axios from "axios";

interface Config {
  url: string;
  method: string;
  baseURL: string | undefined;
  data?: unknown;
  params?: unknown;
}

const apiClient = (url: string, method = "get", data = {}) => {
  // const baseURL = process.env.REACT_APP_API_HOST;
  const baseURL = import.meta.env.VITE_REACT_APP_API_HOST;
  const config: Config = {
    url: url,
    method: method,
    baseURL: baseURL,
  };
  if (method.toLocaleLowerCase() === "get") {
    config["params"] = data;
  } else {
    config["data"] = data;
  }

  const token = localStorage.getItem("token");

  axios.interceptors.request.use((config) => {
    config.headers.traceid = -1;
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  });

  axios.interceptors.response.use((response) => {
    return response;
  });
  return axios(config);
};

export default apiClient;
