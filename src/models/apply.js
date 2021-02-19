import {save, remove, list, basic,getDetail,cancel} from '@/services/apply';

export default {
  namespace: 'apply',

  state: {
    page: {},
  },

  effects: {
    * save({payload, callback}, {call}) {
      const result = yield call(save, payload);
      console.info(result)
      callback(result);
    },
    * delete({payload, callback}, {call}) {
      const result = yield call(remove, payload);
      callback(result);
    },
    * cancel({payload,callback},{call}){
      const result = yield call(cancel, payload);
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
