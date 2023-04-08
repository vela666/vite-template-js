import Layout from '@/Layout'

export default [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
      keepAlive: true,
    },
    component: 'Layout',
    redirect: '/home',
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
    path: '/admin',
    name: 'Admin',
    meta: {
      title: '超管管理中心',
      keepAlive: true,
    },
    component: 'Layout',
    redirect: '/admin/company',
    children: [
      {
        path: 'company',
        name: 'Company',
        meta: {
          title: '公司管理',
          keepAlive: true,
        },
        component: 'admin/company',
      },
      {
        path: 'menu',
        name: 'Menu',
        meta: {
          title: '菜单管理',
          keepAlive: true,
        },
        component: 'admin/menu',
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '管理中心',
      keepAlive: true,
    },
    component: 'Layout',
    redirect: '/system/department',
    children: [
      {
        path: 'department',
        name: 'Department',
        meta: {
          title: '部门与员工',
          keepAlive: true,
        },
        component: 'system/department',
      },
      {
        path: 'project',
        name: 'Project',
        meta: {
          title: '项目管理',
          keepAlive: true,
        },
        component: 'system/project',
      },
      {
        path: 'application',
        name: 'Application',
        meta: {
          title: '应用管理',
          keepAlive: true,
        },
        component: 'system/application',
      },
      {
        path: 'production',
        name: 'Production',
        meta: {
          title: '商品管理',
          keepAlive: true,
        },
        component: 'system/production',
      },
      {
        path: 'tag',
        name: 'Tag',
        meta: {
          title: '标签管理',
          keepAlive: true,
        },
        component: 'system/tag',
      },
    ],
  },
]
