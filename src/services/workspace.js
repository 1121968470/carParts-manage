import request from "@/utils/request";
import {parse, stringify} from "qs";

export async function listMonthCheckStats(params) {
  return request("/api/v1/attend/check/calendar?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function listDateCheckStats(params) {
  return request("/api/v1/attend/check/record?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

