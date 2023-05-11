import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://130.243.235.184:8000/',
});
