import request from '@/utils/request';
import { parse, stringify } from "qs";

export async function list(params) {
    return request("/api/v1/web/user/listAll?" + stringify(params), { method: "GET" });
}
