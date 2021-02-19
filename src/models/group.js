import {save, remove, list, basic,getDetail} from '@/services/group';

export default {
  namespace: 'group',

  state: {
    page: {},
  },

  effects: {
    * save({payload, callback}, {call}) {
      const result = yield call(save, payload);
      callback(result);
    },
    * delete({payload, callback}, {call}) {
      const result = yield call(remove, payload);
      callback(result);
    },
    * basic({callback}, {call}) {
      const result = yield call(basic);
      callback(result);
    },
    * getDetail({payload, callback}, {call}) {
      const result = yield call(getDetail, payload);
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
