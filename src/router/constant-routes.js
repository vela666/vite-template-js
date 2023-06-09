// import Layout from '@/Layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export default [
  /* {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
      keepAlive: true,
    },
    component: Layout,
    // component: () => import('@/components/SelectRangeTime'),
    // redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        meta: {
          title: '首页',
          keepAlive: true,
        },
        component: 'home',
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import(/!* webpackChunkName: "login" *!/ '@views/login'),
  },
  {
    path: '/share',
    name: 'Share',
    meta: {
      title: '分享',
    },
    component: () => import(/!* webpackChunkName: "share" *!/ '@views/share'),
  },
  /!**
   * @description 选择进入国内版还是海外版
   * @author fengjin
   * @date 2022-04-06 10:06:27
   *!/
  {
    path: '/branch',
    name: 'Branch',
    meta: {
      title: '',
      parentId: [],
    },
    component: () => import(/!* webpackChunkName: "branch" *!/ '@views/branch/index'),
  },
  {
    path: '/401',
    name: 'Exception401',
    meta: {
      title: '401 Unauthorized',
      parentId: [],
    },
    component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/401'),
  },
  {
    path: '/403',
    name: 'Exception403',
    meta: {
      title: '403 Forbidden',
      parentId: [],
    },
    component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/403'),
  },
  {
    path: '/404',
    name: 'Exception404',
    replace: false,
    meta: {
      title: '404 Not Found',
    },
    component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/404'),
  },
  {
    path: '/500',
    name: 'Exception500',
    meta: {
      title: '500 Server Error',
      parentId: [],
    },
    component: () => import(/!* webpackChunkName: "exception" *!/ '@views/exception/500'),
  },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/404') },
  */
  /* {
    path: '/demo',
    component: Layout,
    redirect: '/demo/index',
    name: 'ABTest',
    meta: {
      title: '测试1',
      keepAlive: true,
    },
    children: [
      {
        path: '/demo/index',
        name: 'DemoIndex',
        meta: {
          title: '测试2',
          keepAlive: true,
        },
        component: () => import('@/views/demo/Demo.vue'),
        children: [
          {
            meta: {
              title: '测试3',
              keepAlive: true,
            },
            path: '/demo/a',
            name: 'DemoA',
            component: () => import('@/views/demo/a/A.vue'),
          },
        ],
      },
    ],
  },*/
  {
    path: '/401',
    hidden: true,
    name: 'Exception401',
    meta: {
      title: '401 Unauthorized',
    },
    component: () => import('@/views/exception/401'),
  },
  {
    path: '/:pathMatch(.*)*',
    // 不要写name不然动态路由一直在404页面
    // name: 'Exception404',
    hidden: true,
    meta: {
      title: '404 Not Found',
    },
    component: () => import('@/views/exception/404'),
  },
]
