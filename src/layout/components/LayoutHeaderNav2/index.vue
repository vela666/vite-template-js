<template>
  <nav class="layout-header-nav">
    <ul class="nav">
      <li v-for="item in asyncRoutes" :key="item.menu_id" class="nav-item">
        <router-link
          :class="{
            'router-link-active': item.menu_id === $route.meta.parentId[0],
          }"
          :to="item.menu_path"
          class="nav-link"
          >{{ item.menu_name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup name="LayoutHeaderNav">
import usePermissionStore from '@/stores/modules/permission'
import { storeToRefs } from 'pinia'

const store = usePermissionStore()
const { asyncRoutes } = storeToRefs(store)
// 再次输入密码验证
/*let verifyPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== state.updForm.new_password) {
    callback(new Error('两次密码不一致!'))
  } else {
    callback()
  }
}

const validatePass = (rule, value, callback) => {
  if (state.updForm.repPwd && value !== state.updForm.repPwd) {
    callback(new Error('两次输入新密码不一致'))
    return
  }

  // eslint-disable-next-line no-control-regex
  if (
    value.length < 8 ||
    value.length > 64 ||
    /[^\x00-\xff]+/g.test(value) ||
    /^[~`!@#$%^&*()\-_=+{}\[\]:;"'|\\,<.>?/]+$/.test(value) ||
    /^[a-zA-Z]+$/.test(value) ||
    /^[0-9]+$/.test(value)
  ) {
    callback('密码长度至少为8-64位，数字、字母、特殊字符至少包含两种')
    return
  }

  state.updFormRef.validateField('repPwd')
  callback()
}
const validatePass2 = (rule, value, callback) => {
  if (state.updForm.new_password && value !== state.updForm.repPwd) {
    callback(new Error('两次输入的密码不一致，请重新输入'))
    return
  }

  // eslint-disable-next-line no-control-regex
  if (
    value.length < 8 ||
    value.length > 64 ||
    /[^\x00-\xff]+/g.test(value) ||
    /^[~`!@#$%^&*()\-_=+{}\[\]:;"'|\\,<.>?/]+$/.test(value) ||
    /^[a-zA-Z]+$/.test(value) ||
    /^[0-9]+$/.test(value)
  ) {
    callback('密码长度至少为8-64位，数字、字母、特殊字符至少包含两种')
    return
  }

  state.updFormRef.validateField('new_password')
  callback()
}*/
/**
 * @description 获取菜单容器宽度
 * @author fengjin
 * @date 2022-06-08 12:11:35
 */
/*const getMenuWidth = (menus) => {
  const _menus = menus.filter((item) => !item.hidden)
  const column = Math.ceil(_menus.length / 7)
  let length = 0

  for (let i = 0; i < column; i++) {
    length += Math.max(..._menus.slice(i * 7, (i + 1) * 7).map((item) => item.menu_name.length)) + 2
  }

  return `${length}em`
}*/
/*
const navList = computed(() => {
  asyncRoutes.forEach(item => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children.forEach(item2 => {
        if (Array.isArray(item2.children) && item2.children.length > 0) {
          item2.style_width = getMenuWidth(item2.children);
        }
      });
    }
  });

  return asyncRoutes;
})
*/
</script>
<style lang="scss">
.upd-form {
  .el-form-item__label {
    padding: 0;
  }
}

.user-popover.el-popover {
  max-height: 143px;
  padding: 0;
}

.tool-user-other {
  .tool-item {
    color: #616161;
    padding: 12px 20px;

    &:first-of-type {
      i {
        color: $color-primary;
      }

      > div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;

        .svg-icon {
          color: $color-primary;
        }

        span {
          margin-left: 10px;
        }
      }
    }

    &:not(:last-of-type) {
      border-bottom: 1px solid $color-dedede;
    }

    &:not(:first-of-type) {
      .svg-icon,
      span {
        cursor: pointer;
      }

      span {
        margin-left: 10px;
      }

      &:hover {
        .svg-icon,
        span {
          color: $color-primary;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.layout-header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: $interval-36;
  padding-left: $interval-36;
  height: $h-60;
  line-height: $h-60;
  background-color: #fff;
  box-shadow: $box-shadow-base;

  .nav {
    display: flex;
    font-size: 16px;

    > .nav-item-logo {
      margin-right: 60px - 15px;
    }

    .nav-link {
      position: relative;
      display: block;
      padding-right: 15px;
      padding-left: 15px;
      color: $color-616161;

      &:hover {
        color: $color-primary;
      }

      &.router-link-active {
        color: $color-primary;

        &:after {
          position: absolute;
          left: 50%;
          bottom: 0;
          margin-left: -18px;
          display: block;
          width: 36px;
          height: 4px;
          background-color: $color-primary;
          border-radius: $radius-2;
          content: '';
        }
      }
    }
  }

  .tool {
    .svg-icon {
      position: relative;
      top: 2px;
      width: 20px;
      height: 20px;
      fill: $color-primary;
    }

    .user-icon {
      transform: scale(0.9);
    }

    .tool-user {
      color: #1f1f1f;
      font-size: 14px;
      margin-left: 10px;

      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
