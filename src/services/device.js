import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/web/v1/device/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/web/v1/device/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/web/v1/device/delete?" + stringify(params), { method: "GET" });
}
export async function getConfig(params) {
    return request("/web/v1/device/config/get?" + stringify(params), { method: "GET" });
}

export async function setConfig(params) {
    return request("/web/v1/device/config/set", {
        method: "POST",
        body: params
    });
}