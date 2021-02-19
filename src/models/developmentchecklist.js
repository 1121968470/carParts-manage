import {
	list,
	saveOrUpdate,
	del,
    exports,
    changeExports,
    changeList,
    getId,
    saveOrUpdateChange,
    delChange,
    getIdChange
	 }
    from '@/services/developmentchecklist';

export default {
    namespace: 'developmentchecklist',

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
    * getId({payload}, {call, put}) {
        const response = yield call(getId, payload);
        payload.callback && payload.callback(response);
    },
    * exports({ payload, callback }, { call, put }) {
        const response = yield call(exports, payload);
        callback && callback(response);
    },

    * saveChange({ payload, callback }, { call, put }) {
        const response = yield call(saveOrUpdateChange, payload);
        callback && callback(response);
    },
    * changeExports({ payload, callback }, { call, put }) {
        const response = yield call(changeExports, payload);
        callback && callback(response);
    },
    * changeList({ payload, callback }, { call, put }) {
        const response = yield call(changeList, payload);
        payload.callback && payload.callback(response)
    },
    * delChange({ payload, callback }, { call, put }) {
        const response = yield call(delChange, payload);
        callback && callback(response);
    },
    * getIdChange({payload}, {call, put}) {
        const response = yield call(getIdChange, payload);
        payload.callback && payload.callback(response);
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
