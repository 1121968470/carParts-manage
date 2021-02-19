import request from "@/utils/request";
import {parse, stringify} from "qs";

export async function list(params) {
  return request("/api/v1/todo/list?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function deal(params) {
  return request(`/api/v1/todo/${params.id}/deal`, {
    method: "POST",
    body: params
  });
}

export async function getDetail(params) {
  return request(`/api/v1/todo/${params.id}/detail`, {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}