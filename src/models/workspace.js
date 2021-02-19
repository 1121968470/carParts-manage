import {listMonthCheckStats, listDateCheckStats} from '@/services/workspace';

export default {
  namespace: 'workspace',

  state: {
    page: {},
  },

  effects: {
    * listDateCheckStats({payload}, {call, put}) {
      const result = yield call(listDateCheckStats, payload);
      if (result && result.succee) {
        yield put({
          type: 'recordList',
          payload: result,
        });
      }
    },
    * listMonthCheckStats({payload}, {call, put}) {
      const result = yield call(listMonthCheckStats, payload);
      if (result && result.succee) {
        yield put({
          type: 'updateList',
          payload: result,
        });
      }
    },
  },

  reducers: {
    recordList(state, action) {
      return {
        ...state,
        dayRecord: action.payload.data
      }
    },
    updateList(state, action) {

      if (!action.payload.data) {
        return {
          ...state
        };
      }

      return {
        ...state,
        abnormalDays: action.payload.data.abnormalDays,
        normalDays: action.payload.data.normalDays
      };
    },
  },
};
