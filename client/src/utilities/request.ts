/* eslint-disable implicit-arrow-linebreak */
import { isEmpty } from 'lodash';
import configs from '@/configuration';

export class RequestError extends Error {
  statusCode: number;

  success: boolean;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

const getToken = () => localStorage.getItem('survey-app-token');

export const createRequest = async ({ endpoint, method = 'GET', body = null, params = {} }) => {
  const url = `${configs.BE_BASE_URL}${endpoint}`;
  let requestUrl = `${url}${`?${new URLSearchParams(params).toString()}`}`;
  const token = getToken();
  const requestConfig: any = {
    method,
    headers: {
      authorization: token ? `Bearer ${token}` : null,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  };

  if (isEmpty(params)) {
    requestUrl = requestUrl.slice(0, -1);
  }
  const response = await fetch(requestUrl, requestConfig);

  const result = await response.json();

  return new Promise((resolve) => {
    resolve({ ...result, statusCode: response?.status });
  });
};

export const GET = (endpoint, options = {}) =>
  createRequest({
    endpoint,
    ...options,
    method: 'GET',
  });

export const POST = (endpoint, options = {}) =>
  createRequest({
    endpoint,
    ...options,
    method: 'POST',
  });

export const PUT = (endpoint, options = {}) =>
  createRequest({
    endpoint,
    ...options,
    method: 'PUT',
  });

export const DELETE = (endpoint, options = {}) =>
  createRequest({
    endpoint,
    ...options,
    method: 'DELETE',
  });
