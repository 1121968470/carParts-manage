import request from "@/utils/request";
import { parse, stringify } from "qs";

export async function getAccountMsg(params) {//获取当前用户信息
    return request("/api/v1/web/account/login?" + stringify(params), { method: "GET" });
}

export async function list(params) {//获取用户信息
  return request("/api/v1/web/user/list?" + stringify(params), { method: "GET" });
}

export async function pwd(params) {//验证与修改密码
    return request("/api/v1/web/user/pwd", {
        method: "POST",
        body: params
    });
}

export async function getUserPower(params) {//获取全部权限信息
    return request("/api/v1/web/user/getUserPower?" + stringify(params), { method: "GET" });
}

export async function saveOrUpdate(params) {//编辑角色权限
    return request('/api/v1/web/account/save', {
        method: 'POST',
        body: params,
    });
}

export async function saveOrUpdatePower(params) {
    return request('/api/v1/web/user/save', {//添加权限
        method: 'POST',
        body: params,
    });
}

export async function del(params) {
	  return request("/web/v1/user/delete?" + stringify(params), { method: "GET" });
}
export async function all(params) {
	return request("/web/v1/user/all?" + stringify(params), { method: "GET" });
}
export async function detail(params) {
	return request("/web/v1/user/detail?" + stringify(params), { method: "GET" });
}

