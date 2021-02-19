import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/web/v1/card/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/web/v1/card/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/web/v1/card/delete?" + stringify(params), { method: "GET" });
}

