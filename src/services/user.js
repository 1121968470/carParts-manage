import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/web/v1/web/user/listAll');
}

export async function list() {
//  return request("/web/v1/web/user/listAll?" + stringify(params), { method: "GET" });
  return request('/api/v1/web/user/listAll', { method: "GET" });
}