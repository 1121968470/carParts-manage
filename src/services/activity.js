import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function getType(params) {
    return request("/api/v1/web/activity/getType?" + stringify(params), { method: "GET" });
}

export async function delType(params) {
    return request("/api/v1/web/activity/delType?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdateType(params) {
    return request("/api/v1/web/activity/saveType", {
        method: "POST",
        body: params
    });
}


export async function list(params) {
    return request("/api/v1/web/activity/listAll?" + stringify(params), { method: "GET" });
}

export async function get(params) {
    return request("/api/v1/web/activity/get?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
    return request("/api/v1/web/activity/save", {
        method: "POST",
        body: params
    });
}

export async function del(params) {
    return request("/api/v1/web/activity/delete?" + stringify(params), { method: "GET" });
}

export async function top(params) {
    return request("/api/v1/web/activity/top?" + stringify(params), { method: "GET" });
}

export async function down(params) {
    return request("/api/v1/web/activity/untop?" + stringify(params), { method: "GET" });
}
