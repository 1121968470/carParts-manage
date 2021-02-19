import request from '@/utils/request';
import { parse, stringify } from 'qs';


export async function save(params) {
    return request('/web/v1/status/save', {
        method: 'POST',
        body: params,
    });
}

export async function del(params) {
    return request('/web/v1/status/delete?' + stringify(params), {method: 'GET'});
}

export async function listStatus(params) {
    return request('/web/v1/status/list?' + stringify(params), {method: 'GET'});
}

export async function basic(params) {
    return request('/web/v1/userStatus/basic?' + stringify(params), {method: 'GET'});
}
export async function list(params) {
    return request('/web/v1/userStatus/list?' + stringify(params), {method: 'GET'});
}
export async function saveOrUpdate(params) {
    return request('/web/v1/userStatus/save', {
        method: 'POST',
        body: params,
    });
}