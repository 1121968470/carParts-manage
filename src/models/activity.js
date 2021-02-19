import {
	list,
	saveOrUpdate,
	del,
    top,
    down,
    get,
    getType,
    saveOrUpdateType,
	delType,
	 }
    from '@/services/activity';

export default {
  namespace: 'activity',

  state: {
    data: [],
  },

  effects: {
    * getType({ payload, callback }, { call, put }) {
      const response = yield call(getType, payload);
      payload.callback && payload.callback(response);
    },
    * saveType({ payload, callback }, { call, put }) {
        const response = yield call(saveOrUpdateType, payload);
        callback && callback(response);
    },
    * delType({ payload, callback }, { call, put }) {
        const response = yield call(delType, payload);
        callback && callback(response);
    },


    * get({ payload, callback }, { call, put }) {
        const response = yield call(get, payload);
        payload.callback && payload.callback(response);
    },
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
    *top({ payload, callback }, { call, put }) {
        const response = yield call(top, payload);
        callback && callback(response);
    },
    *down({ payload, callback }, { call, put }) {
        const response = yield call(down, payload);
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
