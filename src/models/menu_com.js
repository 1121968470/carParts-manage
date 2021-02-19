import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';

import {list, saveOrUpdate, del,all,listAll} from '@/services/menu';
export default {
  namespace: 'menu_com',

  state: {
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
      * all({ payload, callback }, { call, put }) {
          const response = yield call(all, payload);
          callback && callback(response);
      },
      * listAll({ payload, callback }, { call, put }) {
          const response = yield call(listAll, payload);
          callback && callback(response);
      },

  },
};
