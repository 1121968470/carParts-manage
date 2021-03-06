import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/web/v1/duty/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/web/v1/duty/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/web/v1/duty/delete?" + stringify(params), { method: "GET" });
}

