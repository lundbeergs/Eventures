import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://130.243.227.83:8000/',
});

export const API_REFRESH_URL = axios.create({
  baseURL: 'http://130.243.158.207:8000/',
});

