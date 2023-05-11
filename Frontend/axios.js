import axios from 'axios';

export const API_BASE_URL = axios.create({
  baseURL: 'http://192.168.10.184:8000/',
});
