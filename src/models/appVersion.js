import { list, saveOrUpdate, del, } from '@/services/appVersion';

export default {
  namespace: 'appVersion',

  state: {
    data: [],
  },

  effects: {
    *save({ payload, callback }, { call, put }) {
      const response = yield call(saveOrUpdate, payload);
      callback && callback(response);
    },
    *list({ payload,callback }, { call, put }) {
      const response = yield call(list, payload);
      payload&& callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(del, payload);
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
