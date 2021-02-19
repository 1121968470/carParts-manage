import {
	list,
	saveOrUpdate,
	del
	 }
    from '@/services/card';

export default {
  namespace: 'card',

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
