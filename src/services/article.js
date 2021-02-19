import request from '@/utils/request';
import {parse, stringify} from 'qs';

export async function getType(params) {
    return request('/api/v1/web/article/getType?' + stringify(params), {method: 'GET'});
}

export async function delType(params) {
    return request('/api/v1/web/article/delType?' + stringify(params), {method: 'GET'});
}

export async function saveOrUpdateType(params) {
    return request('/api/v1/web/article/saveType', {
        method: 'POST',
        body: params,
    });
}

export async function get(params) {
    return request('/api/v1/web/article/get?' + stringify(params), {method: 'GET'});
}

export async function getId(params) {
    return request('/api/v1/web/article/getId?' + stringify(params), {method: 'GET'});
}

export async function list(params) {
    return request('/api/v1/web/article/listAll?' + stringify(params), {method: 'GET'});
}

export async function catalog(params) {
    return request('/api/v1/web/article/catalog?' + stringify(params), {method: 'GET'});
}

export async function saveOrUpdate(params) {
    return request('/api/v1/web/article/save', {
        method: 'POST',
        body: params,
    });
}

export async function del(params) {
    return request('/api/v1/web/article/delete?' + stringify(params), {method: 'GET'});
}
