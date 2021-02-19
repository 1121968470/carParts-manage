import {
	list,
	saveOrUpdate,
	del,
	all,
    detail,
    pwd,
	getUserPower,
	getAccountMsg,
	saveOrUpdatePower
	 }
    from '@/services/staff';

export default {
	namespace: 'staff',

	state: {
		data: [],
	},

	effects: {
		* save({ payload, callback }, { call, put }) {
			const response = yield call(saveOrUpdate, payload);
			payload.callback && payload.callback(response)
		},
		* savePower({ payload, callback }, { call, put }) {
			const response = yield call(saveOrUpdatePower, payload);
			callback && callback(response)
		},
		* list({ payload,callback }, { call, put }) {
			const response = yield call(list, payload);
			payload.callback && payload.callback(response)
		},
		* getUserPower({ payload,callback }, { call, put }) {
			const response = yield call(getUserPower, payload);
			payload.callback && payload.callback(response)
		},
		* getAccountMsg ({ payload,callback }, { call, put }) {
			const response = yield call(getAccountMsg, payload);
			payload.callback && payload.callback(response)
		},
		* all({ payload,callback }, { call, put }) {
			const response = yield call(all, payload);
			callback && callback(response)
		},
		* del({ payload, callback }, { call, put }) {
			const response = yield call(del, payload);
			callback && callback(response);
		},
		* detail({ payload, callback }, { call, put }) {
			const response = yield call(detail, payload);
			callback && callback(response);
		},
		* pwd({ payload, callback }, { call, put }) {
			const response = yield call(pwd, payload);
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
