import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://192.168.68.115:8000/',
});

export const API_REFRESH_URL = axios.create({
  baseURL: 'http://192.168.68.115:8000/',
});

