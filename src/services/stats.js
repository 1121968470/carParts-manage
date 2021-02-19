import request from "@/utils/request";
import {parse, stringify} from "qs";

export async function dayList(params) {
  return request("/api/v1/attend/check/checkDateList?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function monthList(params) {
  return request("/api/v1/attend/check/checkSummaryList?" + stringify(params), {
    method: "GET",
    headers: {Accept: 'application/json'},
  });
}

export async function exportDayList(params) {
  return request("/api/v1/attend/check/outputCheckDate?" + stringify(params), {
    method: "GET",
    download:true,
    headers: {Accept: 'application/json'},
  });
}


export async function exportMonthList(params) {
  return request("/api/v1/attend/check/outputSummary?" + stringify(params), {
    method: "GET",
    download:true,
    headers: {Accept: 'application/json'},
  });
}