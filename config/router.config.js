/**
 hideInMenu: true,
 hideChildrenInMenu: true,
 */
export default [
  {
    path: '/',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/user/login' },
      {
        path: '/user/login',
        component: './User/Login',
        name: '用户登录',
      },
      {
        path: '/home',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin'],
        routes: [
          { path: '/home', redirect: '/home/home' },
          {
            id: 'home',
            path: '/home/home',
            name: '首页',
            icon: 'list',
            component: './Home/Home',
          },
          {
            id: 'menu_business',
            path: '/home/business',
            name: '商务部门',
            icon: 'profile',
            routes: [
              {
                id: 'menu_contractDetails',
                path: '/home/business/moldContractDetails',
                name: '模具合同明细',
                icon: 'file',
                component: './MoldContractDetails/MoldContractDetails',
              },
              {
                id: 'menu_reconciliation',
                path: '/home/business/reconciliation',
                name: '模具对账明细',
                icon: 'file',
                component: './Reconciliation/Reconciliation',
              },
            ]
          },
          {
            id: 'menu_exploitation',
            path: '/home/exploitation',
            name: '开发部门',
            icon: 'check-circle-o',
            routes: [
              {
                id: 'menu_checklist',
                path: '/home/exploitation/developmentChecklist',
                name: '制模开发清单',
                icon: 'file',
                component: './DevelopmentChecklist/DevelopmentChecklist',
              },
              {
                id: 'menu_changechecklist',
                path: '/home/exploitation/changedevelopmentChecklist',
                name: '设变/修模清单',
                icon: 'file',
                component: './ChangeDevelopmentlist/ChangeDevelopmentChecklist',
              },
            ]
          }
        ],
      },

      // {path: '/user/register', component: './User/Register'},
      // {path: '/user/register-result', component: './User/RegisterResult'},
    ],
  },
  // {
  //   path: '/user',
  //   component: '../layouts/BasicLayout',
  //   Routes: ['src/pages/Authorized'],
  //   // authority: ['admin'],
  //   routes: [
  //     { path: '/user/userAuth', redirect: '/userAuth' },
  //     {
  //       path: '/userAuth',
  //       name: '验证信息管理',
  //       icon: 'user',
  //       component: './UserAuth/UserAuth',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/activity/activity',
  //       name: '活动管理',
  //       icon: 'user',
  //       component: './Activity/Activity',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/activity/activity/activityEdit',
  //       component: './Activity/ActivityEdit',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/article/article',
  //       name: '文章管理',
  //       icon: 'user',
  //       component: './Article/Article',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/article/article/articleEdit',
  //       component: './Article/ArticleEdit',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/donationProject/donationProject',
  //       name: '捐赠管理',
  //       icon: 'user',
  //       component: './DonationProject/DonationProject',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/donationProject/donationProject/donationProjectEdit',
  //       component: './DonationProject/DonationProjectEdit',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/catalog',
  //       name: '栏目管理',
  //       hideInMenu: true,
  //       routes: [
  //         { path: '/catalog', redirect: '/catalog/activityCatalog' },
  //         {
  //           path: '/catalog/activityCatalog',
  //           name: '活动栏目',
  //           component: './Catalog/activityCatalog',
  //         },
  //         {
  //           path: '/catalog/bbsCatalog',
  //           name: '社区动态栏目',
  //           component: './Catalog/bbsCatalog',
  //         },
  //         {
  //           path: '/catalog/officeCatalog',
  //           name: '官网栏目管理',
  //           component: './Catalog/officeCatalog',
  //         },
  //       ],
  //     },
  //   ],
  // },
  //        {
  //          name:"系统管理",
  //            path:"/system",
  //            icon:"team",
  //            routes:[
  //            ]
  //        },
  //      'activity':{
  //        name:'',
  //        component: dynamicWrapper(app, [''], () =>
  //            import('../routes/ActivityEdit/ActivityEdit')
  //        )
  //      }
  {
    component: '404',
  },
];
