import axios from 'axios';

interface Config {
  url: string;
  method: string;
  baseURL: string | undefined;
  data?: unknown;
  params?: unknown;
}

const apiClient = (url: string, method = 'get', data = {}) => {
  const baseURL = 'http://192.168.100.79:4000/api/v1/';
  const config: Config = {
    url: url,
    method: method,
    baseURL: baseURL,
  };
  if (method.toLocaleLowerCase() === 'get') {
    config['params'] = data;
  } else {
    config['data'] = data;
  }

  const token = localStorage.getItem('token');

  axios.interceptors.request.use((config) => {
    config.headers.traceid = -1;
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      return Promise.reject(error);
    }
  );
  return axios(config);
};

export default apiClient;
