import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function list(params) {
  return request("/api/web/v1/meeting/meeting/list?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {
  return request("/api/web/v1/meeting/meeting/save", {
    method: "POST",
    body: params
  });
}

export async function del(params) {
	  return request("/api/web/v1/meeting/meeting/delete?" + stringify(params), { method: "GET" });
}
export async function exportOne(params) {
	  return request("/api/web/v1/meeting/meeting/export?" + stringify(params), { method: "GET" });
}
export async function exportAll(params) {
	  return request("/api/web/v1/meeting/meeting/export/all?" + stringify(params), { method: "GET" });
}
export async function analyseNumberPlate() {
	return request("/api/web/v1/meeting/meeting/analyseNumberPlate", { method: "GET" });
}

