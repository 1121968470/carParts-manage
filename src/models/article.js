import {
    list,
    saveOrUpdate,
    del,
    catalog,
    getType,
    get,
    saveOrUpdateType,
    delType,
    getId,
} from '@/services/article';

export default {
  namespace: 'article',

  state: {
    data: [],
  },

  effects: {
     * get({payload}, {call, put}) {
      const response = yield call(get, payload);
      payload.callback && payload.callback(response);
    },
     * getId({payload}, {call, put}) {
      const response = yield call(getId, payload);
      payload.callback && payload.callback(response);
    },
      * getType({payload, callback}, {call, put}) {
      const response = yield call(getType, payload);
      payload.callback && payload.callback(response);
    },
      * saveType({payload, callback}, {call, put}) {
          const response = yield call(saveOrUpdateType, payload);
          callback && callback(response);
    },
      * delType({payload, callback}, {call, put}) {
          const response = yield call(delType, payload);
          callback && callback(response);
    },

      * catalog({payload}, {call, put}) {
          const response = yield call(catalog, payload);
          payload.callback && payload.callback(response);
    },
      * save({payload, callback}, {call, put}) {
          const response = yield call(saveOrUpdate, payload);
          callback && callback(response);
    },
      * list({payload}, {call, put}) {
          const response = yield call(list, payload);
          payload.callback && payload.callback(response);
    },
      * del({payload, callback}, {call, put}) {
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
