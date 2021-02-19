import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/web/v1/notice/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/web/v1/notice/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/web/v1/notice/delete?" + stringify(params), { method: "GET" });
}
export async function top(params) {
	  return request("/web/v1/notice/top?" + stringify(params), { method: "GET" });
}
export async function down(params) {
	  return request("/web/v1/notice/down?" + stringify(params), { method: "GET" });
}

