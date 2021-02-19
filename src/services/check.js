import request from "@/utils/request";
import {parse, stringify} from "qs";

export async function list(params) {
  return request("/api/v1/attend/check/list?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function basic() {
  return request("/api/v1/attend/check/basic", {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function exportList(params) {
  return request("/api/v1/attend/check/output?" + stringify(params), {
    method: "GET",
    download: true,
    headers: {Accept: 'application/json'},
  });
}
