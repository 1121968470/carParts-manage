import React from 'react';

const power = {
    powerFilter: function(param) {
        const powerTotal = JSON.parse(localStorage.getItem("userMsg"));//获取全局保存在本地的用户信息
        if (powerTotal && powerTotal.loginStatus){//判断账号是否登录
            const powerFilter = powerTotal.power ? powerTotal.power.split(','): null;//获取操作权限
            let flags = false;//默认全部权限为null
            for (let i in powerFilter) {//循环并开放用户应有的操作权限
                if (powerFilter[i] == param) {
                    flags = true;
                }
            }
            return flags;
        } else {
            return false;
        }
    }
}

module.exports = power;
