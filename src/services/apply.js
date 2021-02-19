import request from "@/utils/request";
import {parse, stringify} from "qs";

export async function list(params) {
  return request("/api/v1/attend/apply/list?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function save(params) {
  return request("/api/v1/attend/apply/save", {
    method: "POST",
    body: params
  });
}

export async function remove(params) {
  return request(`/api/v1/attend/apply/delete?id=${params.id}`, {headers: {Accept: 'application/json'},});
}

export async function getDetail(params) {
  return request(`/api/v1/attend/apply/${params.id}`, {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function basic() {
  return request("/api/v1/attend/apply/basic", {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function cancel(params) {
  return request(`/api/v1/attend/apply/${params.id}/cancel`, {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}
