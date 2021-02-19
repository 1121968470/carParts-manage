import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function list(params) {
    return request("/api/v1/web/donation/listAll?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
    return request("/api/v1/web/donation/save", {
        method: "POST",
        body: params
    });
}

export async function del(params) {
    return request("/api/v1/web/donation/delete?" + stringify(params), { method: "GET" });
}