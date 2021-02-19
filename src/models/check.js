import {list, basic} from '@/services/check';

export default {
  namespace: 'check',

  state: {
    page: {},
  },

  effects: {
    * basic({payload, callback}, {call}) {
      const result = yield call(basic, payload);
      callback(result);
    },
    * fetchList({payload}, {call, put}) {
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
