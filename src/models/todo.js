import {deal, list, getDetail} from '@/services/todo';

export default {
  namespace: 'todo',

  state: {
    page: {},
  },

  effects: {
    * deal({payload, callback}, {call}) {
      const result = yield call(deal, payload);
      callback(result);
    },
    * getDetail({payload, callback}, {call}) {
      const result = yield call(getDetail, payload);
      callback(result);
    },
    * fetchList({payload}, {call, put}) {
      const result = yield call(list, payload);
      if (result && result.succee) {
        yield put({
          type: 'updateTodoList',
          payload: result,
          status: payload.status
        });
      }
    },
  },

  reducers: {
    updateTodoList(state, action) {

      if (!action.payload || !action.payload.data) {
        return {
          ...state
        }
      }

      if (action.status === "HAVED") {

        if (action.payload.page === 1) {
          return {
            ...state,
            havedTodoPage: action.payload
          }
        }

        let items = action.payload.data.filter(item => {
          let exist = false;
          if (state.havedTodoPage && state.havedTodoPage.data) {
            state.havedTodoPage.data.forEach(_item => {
              if (item.id === _item.id) {
                exist = true;
              }
            })
          }
          return !exist;
        });

        let datas = [];
        if (state.havedTodoPage && state.havedTodoPage.data) {
          datas = state.havedTodoPage.data.concat(items)
        } else {
          datas = items;
        }

        return {
          ...state,
          havedTodoPage: Object.assign({}, action.payload, {data: datas})
        }
      } else {
        if (action.payload.page === 1) {
          return {
            ...state,
            todoPage: action.payload
          }
        }

        let items = action.payload.data.filter(item => {
          let exist = false;
          if (state.todoPage && state.todoPage.data) {
            state.todoPage.data.forEach(_item => {
              if (item.id === _item.id) {
                exist = true;
              }
            })
          }
          return !exist;
        });

        let datas = [];
        if (state.todoPage && state.todoPage.data) {
          datas = state.todoPage.data.concat(items)
        } else {
          datas = items;
        }

        return {
          ...state,
          todoPage: Object.assign({}, action.payload, {data: datas})
        }
      }

    },
  },
};
