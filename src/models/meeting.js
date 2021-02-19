import {
	list,
	saveOrUpdate,
	del,
	exportOne,
	exportAll,
	analyseNumberPlate
	 } 
    from '@/services/meeting';

export default {
  namespace: 'meeting',

  state: {
    data: [],
  },

  effects: {
	  	* exportOne({ payload, callback }, { call, put }) {
	       yield call(exportOne, payload);
	    },
	    * exportAll({ payload, callback }, { call, put }) {
		       yield call(exportAll, payload);
		    },
	    * analyseNumberPlate({ payload, callback }, { call, put }) {
	    	 yield call(analyseNumberPlate, payload);
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
