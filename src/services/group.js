import request from "@/utils/request";
import {parse, stringify} from "qs";

export async function list(params) {
  return request("/api/v1/attend/group/list?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function save(params) {
  return request("/api/v1/attend/group/save", {
    method: "POST",
    body: params
  });
}

export async function remove(params) {
  return request(`/api/v1/attend/group/delete?id=${params.id}`, {headers: {Accept: 'application/json'},});
}

export async function getDetail(params) {
  return request("/api/v1/attend/group/getDetail?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function basic() {
  return request("/api/v1/attend/group/basic", {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}
