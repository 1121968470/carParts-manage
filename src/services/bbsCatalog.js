import request from '@/utils/request';
import {parse, stringify} from 'qs';

export async function list(params) {
    return request('/api/v1/web/bbsCatalog/list?' + stringify(params), {method: 'GET'});
}

export async function saveOrUpdate(params) {
    return request('/api/v1/web/bbsCatalog/save', {
        method: 'POST',
        body: params,
    });
}

export async function del(params) {
    return request('/api/v1/web/bbsCatalog//delete?' + stringify(params), {method: 'GET'});
}
