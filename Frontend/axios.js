import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://130.243.212.233:8000/',
});

export const API_REFRESH_URL = axios.create({
  baseURL: 'http://192.168.10.197:8000/',
});

