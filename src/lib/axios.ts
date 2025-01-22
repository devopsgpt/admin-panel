import axios, { AxiosInstance } from 'axios';
import { BASE_API, EXTERNAL_TEMPLATE_API } from '../config/global';

export const engineInstance: AxiosInstance = axios.create({
  baseURL: BASE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const externalTemplateInstance: AxiosInstance = axios.create({
  baseURL: EXTERNAL_TEMPLATE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatInstance: AxiosInstance = axios.create();
