import Layout from '@/layout'
import { reactive, computed, toRefs } from 'vue'
import asyncRoutes from '@/router/async-routes'
import { defineStore } from 'pinia'
import menuMock from './menu.json'
const defaultPath = '../../views/'

// import.meta.glob('../../views/**/!(Test|404).vue'),
// 过滤4开头的文件
const dynamicRoutesModules = import.meta.glob('../../views/**/!(4).vue')
// /path/example => PathExample
console.log(dynamicRoutesModules)
function formatRouteName(str) {
  return str
    .replace('/', '')
    .split('/')
    .map(
      (item) =>
        `${item.substring(0, 1).toUpperCase()}${item
          .substring(1)
          .toLowerCase()}`,
    )
    .join('')
}
/**
 * @description 映射动态路由(超过且包含三级路由转为二级路由，解决keep-alive缓存问题)
 * @param {Array} menus 后端接口返回的菜单列表
 * @param {Number} level 路由嵌套级别 false 代表一层 true 代表超过 一层
 */
function generatorDynamicRoutes(menus = [], isOneLevel = false) {
  const routes = []

  menus.forEach((item) => {
    const route = {
      path: item.menu_path,
      name: formatRouteName(item.menu_path),
      meta: {
        title: item.menu_name,
        keepAlive: item.is_cache,
        id: item.menu_id,
        parentId: [],
      },
      component: null,
    }
    // 去除路径前面和后面的 /
    const comp = item.menu_path.replace(/^\/+|\/+$/g, '')
    if (item.children && item.children.length > 0) {
      // 除了父级 子级如果还包含子级 那么这层component也是layout 如果不想这样 就用下面的方式
      // route.component = Layout
      // 只有第一层组件才是 Layout 其他都是自己本身
      route.component = !isOneLevel
        ? Layout
        : dynamicRoutesModules[`${defaultPath}${comp}.vue`]

      route.redirect = item.children[0].menu_path

      item.children.forEach((childItem) => {
        if (item.parentId) {
          childItem.parentId = [...item.parentId, item.menu_id]
        } else {
          childItem.parentId = [item.menu_id]
        }
      })
      if (isOneLevel) {
        routes.push(...generatorDynamicRoutes(item.children, true))
      } else {
        route.children = generatorDynamicRoutes(item.children, true)
      }
    } else {
      // 去除第一个 /  /home/test2/ = home/test2/
      // const comp = item.menu_path.replace(/\//, '')
      if (item.parentId) route.meta.parentId.push(...item.parentId)
      // comp 路由文件目录位置
      // '../../views/b/index.vue'.match(/[^/]*\.vue$/) 获取文件名index.vue
      // dynamicRoutesModules适合路径完整的: /home/test2/index
      route.component = dynamicRoutesModules[`${defaultPath}${comp}.vue`]
      // console.log(dynamicRoutesModules[`${defaultPath}${comp}.vue`])
      // console.log(comp)
      // 打包后运行不了
      // route.component = () => import(/* @vite-ignore */ `${defaultPath}${comp}`)
      // route.component = () => import(/* @vite-ignore */ '../../views/' + comp)
      // route.component = () => import(/* @vite-ignore */ '/src/views/' + comp)
    }

    routes.push(route)
  })

  return routes
}

export default defineStore('permission', () => {
  const state = reactive({
    asyncRoutesRequested: false,
    // 后台接口返回的原始菜单数据
    asyncRoutes: [],
  })
  const setRoutes = (routes) => {
    state.asyncRoutes = routes
    state.asyncRoutesRequested = true
  }

  const generateRoutes = computed(() => {
    return [...generatorDynamicRoutes(state.asyncRoutes || []), ...asyncRoutes]
  })
  // 获取菜单
  const getMenus = async () => {
    // 根据用户类型获取当前用户菜单
    // const { data } = await getMenuInfo()
    const { data } = menuMock
    // console.log('根据用户类型获取当前用户菜单 => ', data)
    // 过滤一遍菜单，除了首页以外，其他菜单如果二级菜单为空，在移除该以及菜单
    let _data = []
    data.forEach((menu) => {
      if (menu.menu_path === '/home') {
        _data.push(menu)
      } else {
        if (Array.isArray(menu.children) && menu.children.length > 0) {
          _data.push(menu)
        }
      }
    })
    // 手动添加部分特殊页面到指定动态菜单下（不显示在菜单栏中请添加属性hidden值为true）
    const special_page_map = new Map([
      [
        '/asset/material',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-07-11 09:53:25',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434466cb9731a1',
            menu_name: '待办空间',
            menu_path: '/asset/material/examine',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-07-11 09:53:25',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434477cb9731a2',
            menu_name: '批阅空间',
            menu_path: '/asset/material/examine/examine-workspace',
            menu_sort: 2,
            type: 0,
          },
          {
            menu_id: 'a4dbec34d4ee64c5bbdba1f95903bd2b1',
            not_handle: true,
            type: 0,
            menu_name: '个人资产',
            button_name: '',
            menu_sort: 6,
            menu_icon: '',
            menu_path: '/asset/private-assetsl',
            is_cache: false,
            menu_type: 0,
            is_enable: 0,
            create_time: '2022-09-05 10:33:53',
            children: [
              {
                menu_id: 'a7ed3922b7141c790b95c34af39730423',
                type: 0,
                menu_name: '个人素材库',
                button_name: '',
                menu_sort: 0,
                menu_icon: '',
                menu_path: '/asset/private-assetsl/material/index',
                is_cache: true,
                menu_type: 0,
                is_enable: 0,
                create_time: '2022-09-05 10:35:03',
                children: [],
              },
              {
                menu_id: 'a7ed3922b7141c790b95c34af3973099a',
                type: 0,
                menu_name: '回收站',
                button_name: '',
                menu_sort: 0,
                menu_icon: '',
                menu_path: '/asset/private-assetsl/recovery/index',
                is_cache: true,
                menu_type: 0,
                is_enable: 0,
                create_time: '2022-09-22 10:41:47',
                children: [],
              },
            ],
          },
        ],
      ],
      [
        '/asset/toutiao/target',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-09-27 10:42:41',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434488cb9731a4',
            menu_name: '定向包',
            menu_path: '/asset/toutiao/target/addTarget',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/asset/toutiao/event-management',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-04-06 16:52:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f644d434488cb9731a5',
            menu_name: '事件资产详情',
            menu_path: '/asset/toutiao/event-management/EventAssetDetails',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/asset/kuaishou/target',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-12-24 10:00:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434488cb9731a8',
            menu_name: '定向包',
            menu_path: '/asset/kuaishou/target/AddTarget',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/toutiao',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-10-20 14:52:28',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a5',
            menu_name: '程序化创建',
            menu_path: '/platform/toutiao/programmed',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-12-15 16:21:48',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a6',
            menu_name: '定时任务详情',
            menu_path: '/platform/toutiao/advertising/task/details',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/kuaishou/advertising',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-10-20 14:52:28',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a6',
            menu_name: '程序化创建',
            menu_path: '/platform/kuaishou/programmed',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-03-08 15:37:35',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a12',
            menu_name: '定时任务详情',
            menu_path: '/platform/kuaishou/advertising/task/details',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/google/advertising',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2021-10-20 14:52:28',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a7',
            menu_name: '程序化创建',
            menu_path: '/platform/google/programmed',
            menu_sort: 2,
            type: 0,
          },
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-04-18 10:44:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731at5',
            menu_name: '详情信息',
            menu_path: '/platform/google/advertising/task/details',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/asset/facebook/protected-audience',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-6-21 16:00:00',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdfe5b49f684d434488cb973ase',
            menu_name: '保存的受众',
            menu_path: '/asset/facebook/protected-audience/AddAudience',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
      [
        '/platform/facebook/advertising',
        [
          {
            hidden: true,
            button_name: '',
            children: [],
            create_time: '2022-06-28 16:27:32',
            is_cache: false,
            is_enable: 0,
            menu_icon: '',
            menu_id: 'a9fda0fdff684d434488cbe5b499731a8',
            menu_name: '程序化创建',
            menu_path: '/platform/facebook/programmed',
            menu_sort: 2,
            type: 0,
          },
        ],
      ],
    ])

    function add_page(list) {
      list.forEach((i) => {
        const page = special_page_map.get(i.menu_path)
        if (page) {
          list.push(...page)
        }
        if (i.children && i.children.length > 0) {
          add_page(i.children)
        }
      })
    }

    add_page(_data)
    // 排序
    _data = _data.map((item) => {
      if (/^\/asset$/.test(item.menu_path)) {
        item.children.sort((a, b) => b.menu_sort - a.menu_sort)
      }
      return item
    })
    setRoutes(_data)
  }

  return {
    ...toRefs(state),
    generateRoutes,
    getMenus,
  }
})
