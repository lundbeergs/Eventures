import axios from 'axios';

// Change to your own ip-adress to use the application
export const API_BASE_URL = axios.create({
  baseURL: 'http://192.168.10.117:8000/',
});

export const API_REFRESH_URL = axios.create({
  baseURL: 'http://130.243.218.18:8000/',
});

