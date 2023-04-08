// import Layout from '@/Layout'

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
]
