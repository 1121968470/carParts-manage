import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/web/v1/org/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/web/v1/org/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/web/v1/org/delete?" + stringify(params), { method: "GET" });
}
export async function all(params) {
	  return request("/web/v1/org/all", { method: "GET" });
}
export async function listChild(params) {
    return request("/web/v1/org/children?" + stringify(params), { method: "GET" });
}
export async function get(params) {
    return request("/web/v1/org/get?" + stringify(params), { method: "GET" });
}
export async function basic(params) {
    return request("/web/v1/org/basic", { method: "GET" });
}

