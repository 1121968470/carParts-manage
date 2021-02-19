import request from '@/utils/request';
import { parse, stringify } from 'qs';

export async function list(params) {
  return request('/web/v1/menu/list?' + stringify(params), { method: 'GET' });
}

export async function saveOrUpdate(params) {
  return request('/web/v1/menu/save', {
    method: 'POST',
    body: params,
  });
}

export async function del(params) {
  return request('/web/v1/menu/delete?' + stringify(params), { method: 'GET' });
}
export async function all(params) {
  return request('/web/v1/menu/all', { method: 'GET' });
}
export async function listAll(params) {
  return request('/web/v1/menu/listAll', { method: 'GET' });
}

export async function getMenuData(params) {
  return request('/web/v1/menu/getMenuData', { method: 'GET' });
}
