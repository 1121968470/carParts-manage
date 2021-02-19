import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/web/v1/role/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/web/v1/role/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/web/v1/role/delete?" + stringify(params), { method: "GET" });
}

