import { list, saveOrUpdate, del, detail, listByName } from '@/services/office';

export default {
  namespace: 'office',

  state: {
    data: [],
  },

  effects: {
    *save({ payload, callback }, { call, put }) {
      const response = yield call(saveOrUpdate, payload);
      callback && callback(response);
    },
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      payload.callback && payload.callback(response);
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(del, payload);
      callback && callback(response);
    },
    *detail({ payload, callback }, { call, put }) {
      const response = yield call(detail, payload);
      callback && callback(response);
    },
    *listByName({ payload, callback }, { call, put }) {
      const response = yield call(listByName, payload);
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
