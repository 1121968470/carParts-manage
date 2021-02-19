import {list, saveOrUpdate, del, get} from '@/services/activityCatalog';

export default {
    namespace: 'activityCatalog',

    state: {
        data: [],
    },

    effects: {
        * get({payload, callback}, {call, put}) {
            const response = yield call(get, payload);
            callback && callback(response);
        },
        * save({payload, callback}, {call, put}) {
            const response = yield call(saveOrUpdate, payload);
            callback && callback(response);
        },
        * list({payload, callback}, {call, put}) {
            const response = yield call(list, payload);
            callback && callback(response);
        },
        * del({payload, callback}, {call, put}) {
            const response = yield call(del, payload);
            callback && callback(response);
        },
    },
    reducers: {
        updateList(state, payload) {
            return {
                ...state,
                payload,
            };
        },
    },
};
