import { save, remove, list, get } from '@/services/shift';

export default {
  namespace: 'shift',

  state: {
    page: {},
  },

  effects: {
    *save({ payload, callback }, { call }) {
      const result = yield call(save, payload);
      callback(result);
    },
    *get({ payload, callback }, { call }) {
      const result = yield call(get, payload);
      callback(result);
    },
    *delete({ payload, callback }, { call }) {
      const result = yield call(remove, payload);
      callback(result);
    },
    *fetchList({ payload }, { call, put }) {
      const result = yield call(list, payload);
      if (result && result.succee) {
        yield put({
          type: 'updateList',
          payload: result,
        });
      }
    },
  },

  reducers: {
    updateList(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
  },
};
