import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://130.243.231.6:8000/',
});
