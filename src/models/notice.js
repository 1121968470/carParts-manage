import {
	list,
	saveOrUpdate,
	del,
    top,
    down
	 }
    from '@/services/notice';

export default {
  namespace: 'notice',

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
