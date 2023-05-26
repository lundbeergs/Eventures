import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://172.20.10.2:8000/',
});

export const API_REFRESH_URL = axios.create({
  baseURL: 'http://172.20.10.2:8000/',
});

