import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function getType(params) {
    return request("/api/v1/web/donationProject/getType?" + stringify(params), { method: "GET" });
}

export async function delType(params) {
    return request("/api/v1/web/donationProject/delType?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdateType(params) {
    return request("/api/v1/web/donationProject/saveType", {
        method: "POST",
        body: params
    });
}


export async function list(params) {
    return request("/api/v1/web/donationProject/listAll?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
    return request("/api/v1/web/donationProject/save", {
        method: "POST",
        body: params
    });
}

export async function get(params) {
    return request("/api/v1/web/donationProject/get?" + stringify(params), { method: "GET" });
}

export async function del(params) {
    return request("/api/v1/web/donationProject/delete?" + stringify(params), { method: "GET" });
}