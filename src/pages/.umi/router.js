import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from 'D:/project/carParts-manage/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/UserLayout'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/index.html",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('D:/project/carParts-manage/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import('../User/Login'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
        "name": "用户登录",
        "exact": true
      },
      {
        "path": "/home",
        "component": _dvaDynamic({
  
  component: () => import('../../layouts/BasicLayout'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
        "Routes": [require('../Authorized').default],
        "authority": [
          "admin"
        ],
        "routes": [
          {
            "path": "/home",
            "redirect": "/home/home",
            "exact": true
          },
          {
            "id": "home",
            "path": "/home/home",
            "name": "首页",
            "icon": "list",
            "component": _dvaDynamic({
  
  component: () => import('../Home/Home'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "id": "menu_business",
            "path": "/home/business",
            "name": "商务部门",
            "icon": "profile",
            "routes": [
              {
                "id": "menu_contractDetails",
                "path": "/home/business/moldContractDetails",
                "name": "模具合同明细",
                "icon": "file",
                "component": _dvaDynamic({
  
  component: () => import('../MoldContractDetails/MoldContractDetails'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "id": "menu_reconciliation",
                "path": "/home/business/reconciliation",
                "name": "模具对账明细",
                "icon": "file",
                "component": _dvaDynamic({
  
  component: () => import('../Reconciliation/Reconciliation'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "component": () => React.createElement(require('D:/project/carParts-manage/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "id": "menu_exploitation",
            "path": "/home/exploitation",
            "name": "开发部门",
            "icon": "check-circle-o",
            "routes": [
              {
                "id": "menu_checklist",
                "path": "/home/exploitation/developmentChecklist",
                "name": "制模开发清单",
                "icon": "file",
                "component": _dvaDynamic({
  
  component: () => import('../DevelopmentChecklist/DevelopmentChecklist'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "id": "menu_changechecklist",
                "path": "/home/exploitation/changedevelopmentChecklist",
                "name": "设变/修模清单",
                "icon": "file",
                "component": _dvaDynamic({
  
  component: () => import('../ChangeDevelopmentlist/ChangeDevelopmentChecklist'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "component": () => React.createElement(require('D:/project/carParts-manage/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "component": () => React.createElement(require('D:/project/carParts-manage/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": () => React.createElement(require('D:/project/carParts-manage/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": _dvaDynamic({
  
  component: () => import('../404'),
  LoadingComponent: require('D:/project/carParts-manage/src/components/PageLoading/index').default,
}),
    "exact": true
  },
  {
    "component": () => React.createElement(require('D:/project/carParts-manage/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
