import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function list(params) {
    return request("/api/v1/web/reconciliation/list?" + stringify(params), { method: "GET" });
}

export async function listTotal(params) {
    return request("/api/v1/web/reconciliation/listTotal?" + stringify(params), { method: "GET" });
}

export async function exports(params) {
    return request('/api/v1/web/reconciliation/excelExports', {
        method: 'POST',
        body: params,
    });
}

export async function getId(params) {
    return request('/api/v1/web/reconciliation/getId?' + stringify(params), {method: 'GET'});
}

export async function del(params) {
    return request("/api/v1/web/reconciliation/delete?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
    return request("/api/v1/web/reconciliation/save", {
        method: "POST",
        body: params
    });
}

export async function deriveExcel(params) {
    return request("/api/v1/web/reconciliation/deriveExcel?" + stringify(params), { method: "GET" });
}



