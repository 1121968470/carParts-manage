import request from '@/utils/request';
import { parse, stringify } from 'qs';

export async function list(params) {
  return request('/api/v1/attend/shift/list?' + stringify(params), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
}

export async function save(params) {
  return request('/api/v1/attend/shift/save', {
    method: 'POST',
    body: params,
  });
}

export async function get(params) {
  return request(`/api/v1/attend/shift/get/${params.id}`, {
    headers: { Accept: 'application/json' },
  });
}

export async function remove(params) {
  return request(`/api/v1/attend/shift/delete?id=${params.id}`, {
    headers: { Accept: 'application/json' },
  });
}

export async function all(params) {
  return request('/api/v1/attend/shift/list?' + stringify(params), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
}
