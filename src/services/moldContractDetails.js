import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function listTotal(params) {
    return request("/api/v1/web/contractdetails/listTotal?" + stringify(params), { method: "GET" });
}

export async function list(params) {
    return request("/api/v1/web/contractdetails/listAll?" + stringify(params), { method: "GET" });
}

export async function exports(params) {
    return request('/api/v1/web/contractdetails/excelExports', {
        method: 'POST',
        body: params,
    });
}

export async function saveOrUpdate(params) {
    return request("/api/v1/web/contractdetails/save", {
        method: "POST",
        body: params
    });
}

export async function del(params) {
    return request("/api/v1/web/contractdetails/delete?" + stringify(params), { method: "GET" });
}

export async function getId(params) {
    return request('/api/v1/web/contractdetails/getId?' + stringify(params), {method: 'GET'});
}

export async function directSummarize(params) {
    return request('/api/v1/web/contractdetails/directSummarize?' + stringify(params), {method: 'GET'});
}

export async function dieStall(params) {
    return request('/api/v1/web/contractdetails/dieStall?' + stringify(params), {method: 'GET'});
}

export async function outProcess(params) {
    return request('/api/v1/web/contractdetails/outProcess?' + stringify(params), {method: 'GET'});
}

export async function assumedChange(params) {
    return request('/api/v1/web/contractdetails/assumedChange?' + stringify(params), {method: 'GET'});
}
export async function dermatoglyph(params) {
    return request('/api/v1/web/contractdetails/dermatoglyph?' + stringify(params), {method: 'GET'});
}

