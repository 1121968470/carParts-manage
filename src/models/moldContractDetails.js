import {
	list,
	saveOrUpdate,
	del,
    exports,
    getId,
    listTotal,
    directSummarize,
    dieStall,
    outProcess,
    assumedChange,
    dermatoglyph
} from '@/services/moldContractDetails';

export default {
  namespace: 'moldContractDetails',

  state: {
    data: [],
  },

  effects: {
    * save({ payload, callback }, { call, put }) {
        const response = yield call(saveOrUpdate, payload);
        callback && callback(response);
    },
    * list({ payload }, { call, put }) {
        const response = yield call(list, payload);
        payload.callback && payload.callback(response)
    },
    * del({ payload, callback }, { call, put }) {
        const response = yield call(del, payload);
        callback && callback(response);
    },
    * exports({ payload, callback }, { call, put }) {
        const response = yield call(exports, payload);
        callback && callback(response);
    },
    * getId({payload}, {call, put}) {
        const response = yield call(getId, payload);
        payload.callback && payload.callback(response);
    },
    * listTotal({ payload }, { call, put }) {
      const response = yield call(listTotal, payload);
      payload.callback && payload.callback(response)
    },
    * directSummarize({ payload }, { call, put }) {
      const response = yield call(directSummarize, payload);
      payload.callback && payload.callback(response)
    },
    * dieStall({ payload }, { call, put }) {
      const response = yield call(dieStall, payload);
      payload.callback && payload.callback(response)
    },
    * outProcess({ payload }, { call, put }) {
      const response = yield call(outProcess, payload);
      payload.callback && payload.callback(response)
    },
    * assumedChange ({ payload }, { call, put }) {
      const response = yield call(assumedChange, payload);
      payload.callback && payload.callback(response)
    },
    * dermatoglyph({ payload }, { call, put }) {
      const response = yield call(dermatoglyph, payload);
      payload.callback && payload.callback(response)
    },
  },
  reducers:{
	  updateList(state,payload){
		  return {
			  ...state,
			  payload
		  }
	  }
  }

};
