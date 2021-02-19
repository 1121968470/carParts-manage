import {list, saveOrUpdate, del, basic, listStatus, save} from '@/services/userStatus';

export default {
  namespace: 'userStatus',

  state: {
    data: [],
  },

  effects: {
      * saveOrUpdate({payload, callback}, {call, put}) {
      const response = yield call(saveOrUpdate, payload);
      callback && callback(response);
      },
      * save({payload, callback}, {call, put}) {
          const response = yield call(save, payload);
          callback && callback(response);
      },
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      payload.callback && payload.callback(response);
    },
      * listStatus({payload, callback}, {call, put}) {
          const response = yield call(listStatus, payload);
          callback && callback(response);
      },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(del, payload);
      callback && callback(response);
    },
    *basic({ payload, callback }, { call, put }) {
      const response = yield call(basic, payload);
      callback && callback(response);
    },

  },
  reducers: {
    updateList(state, payload) {
      return {
        ...state,
        payload,
      };
    },
  },
};
