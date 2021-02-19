import request from '@/utils/request';
import { parse, stringify } from 'qs';

export async function list(params) {
  return request('/web/v1/office/list?' + stringify(params), { method: 'GET' });
}

export async function saveOrUpdate(params) {
  return request('/web/v1/office/save', {
    method: 'POST',
    body: params,
  });
}

export async function del(params) {
  return request('/web/v1/office/delete?' + stringify(params), { method: 'GET' });
}

export async function listByName(params) {
  return request('/web/v1/office/list/name?' + stringify(params), { method: 'GET' });
}
export async function detail(params) {
  return request('/web/v1/office/detail?' + stringify(params), { method: 'GET' });
}
