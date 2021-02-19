import {
	list,
	saveOrUpdate,
	del,
    setConfig,
	getConfig
	 }
    from '@/services/device';

export default {
  namespace: 'device',

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
    * setConfig({ payload, callback }, { call, put }) {
	      const response = yield call(setConfig, payload);
	      callback && callback(response);
	   },
    * getConfig({ payload, callback }, { call, put }) {
	      const response = yield call(getConfig, payload);
	      callback && callback(response);
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
