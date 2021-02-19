import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, changeStatus } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { encode } from "@/utils/md5";

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload,callback}, { call, put }) {
      payload = Object.assign(payload, { password: payload.password&&encode(payload.password) });

      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response&&response.succee) {//修改过
        payload = Object.assign(payload, { id: response.data.id, loginStatus: true });
        yield call(changeStatus, payload);

        const userMsg = {
          ...payload,
          power: response.data.power,
          userName:  response.data.userName,
        }

        // yield put({
        //   type: "changeLoginStatus",
        //   payload: {
        //     ...response.data,
        //     status: true,
        //     currentAuthority: 'admin',
        //   },
        // });

        localStorage.setItem("userMsg", JSON.stringify(userMsg));//存储本地全局变量
        reloadAuthorized();
        window.location.href='/home/home';
      }else{
          callback(response)
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      let response = JSON.parse(localStorage.getItem("userMsg"));
      if (response) {
        // response = Object.assign(response, { id: response.id, loginStatus: false });
        yield call(changeStatus, { id: response.id, loginStatus: false });
        localStorage.setItem("userMsg", null);//存储本地全局变量
        reloadAuthorized();
        yield put(
            routerRedux.push({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            })
        );
      } else {
        window.location.href = "/user/login"
      }
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: {
      //     status: false,
      //     currentAuthority: 'guest',
      //   },
      // });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
