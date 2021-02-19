import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';

const { check } = Authorized;

let powerTotal = JSON.parse(localStorage.getItem("userMsg"));

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
    return data
    .map(item => {
        if (!item.name || !item.path) {
            return null;
        }

        let locale = 'menu';
        if (parentName) {
            locale = `${parentName}.${item.name}`;
        } else {
            locale = `menu.${item.name}`;
        }

        const result = {
            ...item,
            name: formatMessage({ id: locale, defaultMessage: item.name }),
            locale,
            authority: item.authority || parentAuthority,
        };
        if (item.routes) {
            const children = formatter(item.routes, item.authority, locale);
            // Reduce memory usage
            result.children = children;
        }
        delete result.routes;
        return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
* get SubMenu or Item
*/
const getSubMenu = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideInMenu && item.children.some(child => child.name)) {
        return {
            ...item,
            children: filterMenuData(item.children), // eslint-disable-line
        };
    }
    return item;
};

/**
* filter menuData
*/
const filterMenuData = menuData => {
    if (!menuData) {
        return [];
    }
    const powerFilter = powerTotal.power ? powerTotal.power.split(','): null;
    let urlFilter = [];
    return menuData
    .filter(item => item.name && !item.hideInMenu )
    .map(item => {
        item.hideInMenu = true;//默认菜单栏全部不显示
        if (item.id == 'home') {
            urlFilter.push(item.path);
            item.hideInMenu = false; //开放首页
        }
        for (let i in powerFilter) {//遍历用户权限
            if (item.id == powerFilter[i]) {
                urlFilter.push(item.path);
                item.hideInMenu = false; //开放菜单栏
            }
        }
        localStorage.setItem("urlFilter", urlFilter);
        const ItemDom = getSubMenu(item);
        const data = check(item.authority, ItemDom);
        return data;
    })
    .filter(item => item);
};

import { getMenuData } from '@/services/menu';
export default {
    namespace: 'menu',

    state: {
        menuData: [],
    },

    effects: {
        *getMenuData({ payload }, { call, put }) {
        //      const response = yield call(getMenuData, payload);
        //      response.data
            const { routes, authority } = payload;
            yield put({
                type: 'save',
                payload: filterMenuData(memoizeOneFormatter(routes, authority)),
            });
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                menuData: action.payload,
            };
        },
    },
};
