import {
	list,
	saveOrUpdate,
	del,
	all,
    listChild,
    get,
    basic,
	 }
    from '@/services/org';

export default {
  namespace: 'org',

  state: {
    data: [],
  },

  effects: {
	  * save({ payload, callback }, { call, put }) {
	      const response = yield call(saveOrUpdate, payload);
	      callback && callback(response);

	    },
      * list({payload, callback}, {call, put}) {
	      const response = yield call(list, payload);
          callback && callback(response)

	   },
    * del({ payload, callback }, { call, put }) {
	      const response = yield call(del, payload);
	      callback && callback(response);
	   },
    * all({ payload, callback }, { call, put }) {
	      const response = yield call(all, payload);
	      callback && callback(response);
	   },
    * listChild({ payload, callback }, { call, put }) {
	      const response = yield call(listChild, payload);
	      callback && callback(response);
	   },
    * get({ payload, callback }, { call, put }) {
	      const response = yield call(get, payload);
	      callback && callback(response);
	   },
    * basic({ payload, callback }, { call, put }) {
	      const response = yield call(basic, payload);
	      callback && callback(response);
	   }
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
