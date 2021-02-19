import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function list(params) {
    return request("/api/v1/web/developmentlist/listAll?" + stringify(params), { method: "GET" });
}

export async function exports(params) {
    return request('/api/v1/web/developmentlist/exports', {
        method: 'POST',
        body: params,
    });
}

export async function getId(params) {
    return request('/api/v1/web/developmentlist/getId?' + stringify(params), {method: 'GET'});
}

export async function del(params) {
    return request("/api/v1/web/developmentlist/delete?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
    return request("/api/v1/web/developmentlist/save", {
        method: "POST",
        body: params
    });
}

export async function changeList(params) {
    return request("/api/v1/web/developmentlist/changeListAll?" + stringify(params), { method: "GET" });
}

export async function changeExports(params) {//设变数据
    return request('/api/v1/web/developmentlist/changeExports', {
        method: 'POST',
        body: params,
    });
}
export async function getIdChange(params) {
    return request('/api/v1/web/developmentlist/getIdChange?' + stringify(params), {method: 'GET'});
}

export async function delChange(params) {
    return request("/api/v1/web/developmentlist/deleteChange?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdateChange(params) {
    return request("/api/v1/web/developmentlist/saveChange", {
        method: "POST",
        body: params
    });
}

