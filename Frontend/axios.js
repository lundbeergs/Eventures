import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://212.25.146.119:8000/',
});

export const API_REFRESH_URL = axios.create({
  baseURL: 'http://130.243.154.25:8000/',
});

