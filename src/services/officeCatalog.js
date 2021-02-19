import request from '@/utils/request';
import {parse, stringify} from 'qs';

export async function list(params) {
    return request('/api/v1/web/officeCatalog/list?' + stringify(params), {method: 'GET'});
}

export async function listAll() {
    return request('/api/v1/web/officeCatalog/listAll', {method: 'GET'});
}

export async function saveOrUpdate(params) {
    return request('/api/v1/web/officeCatalog/save', {
        method: 'POST',
        body: params,
    });
}

export async function del(params) {
    return request('/api/v1/web/officeCatalog//delete?' + stringify(params), {method: 'GET'});
}
