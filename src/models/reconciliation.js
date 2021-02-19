import {
    list,
    listTotal,
    saveOrUpdate,
    del,
    getId,
    exports,
    deriveExcel,
}
    from '@/services/reconciliation';

export default {
    namespace: 'reconciliation',

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
        * listTotal({ payload }, { call, put }) {
            const response = yield call(listTotal, payload);
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
        * deriveExcel({ payload, callback }, { call, put }) {
            const response = yield call(deriveExcel, payload);
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
