import {dayList, monthList,exportDayList,exportMonthList} from '@/services/stats';

export default {
  namespace: 'stats',

  state: {
    page: {},
  },

  effects: {
    * exportDayList({payload},{call}){
      const response =  call(exportDayList,payload);
      return response;
    },
    * exportMonthList({payload},{call}){
      return call(exportMonthList,payload);
    },
    * fetchDayList({payload}, {call, put}) {
      const result = yield call(dayList, payload);
      if (result && result.succee) {
        yield put({
          type: 'updateList',
          payload: result,
        });
      }
    },
    * fetchMonthList({payload}, {call, put}) {
      const result = yield call(monthList, payload);
      if (result && result.succee) {
        yield put({
          type: 'updateList',
          payload: result,
        });
      }
    },
  },

  reducers: {
    updateList(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
  },
};
