<template>
  <nav class="layout-header-nav">
    <ul class="nav">
      <li v-for="item1 of asyncRoutes" :key="item1.menu_id" class="nav-item">
        <router-link
          v-if="item1.children?.length === 0"
          :class="{
            'router-link-active': item1.menu_id === $route.meta.parentId[0],
          }"
          :to="item1.menu_path"
          class="nav-link"
          >{{ item1.menu_name }}
        </router-link>

        <el-popover
          v-else
          :show-arrow="false"
          width="auto"
          :offset="1"
          placement="bottom"
          popper-class="popover-header-menu"
          trigger="hover">
          <template #reference>
            <span
              :class="{
                'router-link-active': item1.menu_id === $route.meta.parentId[0],
              }"
              class="nav-link"
              >{{ item1.menu_name }}</span
            >
          </template>
          <ul class="menu-list">
            <template v-for="item2 in item1.children" :key="item2.menu_id">
              <li v-if="!item2.hidden" class="menu-item">
                <template v-if="item2.children?.length > 0">
                  <div class="menu-title">{{ item2.menu_name }}</div>
                  <!--                  <ul class="menu-list" :style="{ width: item2.style_width }">-->
                  <ul class="menu-list">
                    <template
                      v-for="item3 in item2.children"
                      :key="item3.menu_id">
                      <li v-if="!item3.hidden" class="menu-item">
                        <div class="menu-name">
                          <router-link
                            :to="item3.menu_path"
                            :class="{
                              'router-link-active':
                                item3.menu_id === $route.meta.parentId[2],
                            }"
                            >{{ item3.menu_name }}
                          </router-link>
                        </div>
                      </li>
                    </template>
                  </ul>
                </template>
                <div v-else class="menu-name">
                  <router-link
                    :to="item2.menu_path"
                    :class="{
                      'router-link-active':
                        item2.menu_id === $route.meta.parentId[1],
                    }"
                    >{{ item2.menu_name }}
                  </router-link>
                </div>
              </li>
            </template>
          </ul>
        </el-popover>
      </li>
    </ul>
  </nav>
  <el-breadcrumb v-if="breadcrumbList.length" class="layout-menu-breadcrumb">
    <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.menu_id">{{
      item.menu_name
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup name="LayoutHeaderNav">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import usePermissionStore from '@/stores/modules/permission'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const store = usePermissionStore()
const { asyncRoutes } = storeToRefs(store)
/*// 再次输入密码验证
let verifyPwd = (rule, value, callback) => {
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
}
/!**
 * @description 获取菜单容器宽度
 * @author fengjin
 * @date 2022-06-08 12:11:35
 *!/
const getMenuWidth = (menus) => {
  const _menus = menus.filter((item) => !item.hidden)
  const column = Math.ceil(_menus.length / 7)
  let length = 0

  for (let i = 0; i < column; i++) {
    length +=
      Math.max(
        ..._menus
          .slice(i * 7, (i + 1) * 7)
          .map((item) => item.menu_name.length),
      ) + 2
  }

  return `${length}em`
}*/
const breadcrumbList = computed(() => {
  const menus = []
  /**
   * @description 只有一级菜单的不管（route.meta.parentId长度为0）
   * @author fengjin
   * @date 2022-06-08 16:16:35
   */
  route.meta.parentId.forEach((menu_id, index) => {
    if (index === 0) {
      const item = asyncRoutes.value.find((item) => item.menu_id === menu_id)
      if (item) menus.push(item)
      return
    }

    if (index === 1 && menus[0]) {
      const item = menus[0].children.find((item) => item.menu_id === menu_id)
      if (item) menus.push(item)
    }
  })
  if (menus[menus.length - 1]) {
    const item = menus[menus.length - 1].children.find(
      (item) => item.menu_id === route.meta.id,
    )
    if (item) menus.push(item)
  }

  return menus
})
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
.el-popover.popover-header-menu {
  padding: 10px 20px;
  font-size: 14px;

  > .menu-list {
    display: flex;
    justify-content: stretch;

    > .menu-item {
      display: flex;
      flex-direction: column;
      padding: 5px 10px;

      & + .menu-item {
        margin-left: 10px;
      }

      a {
        white-space: nowrap;
        color: $color-616161;

        &:hover,
        &.router-link-active {
          color: $color-primary;
        }
      }

      > .menu-title {
        position: relative;
        padding-right: 1em;
        padding-left: 1em;
        height: 25px;
        line-height: 16px;
        font-weight: 700;
        white-space: nowrap;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 16px;
          background-color: $color-primary;
          border-radius: $radius-2;
          content: '';
        }
      }

      .menu-list {
        display: flex;
        flex-wrap: wrap;
        max-height: 210px;
        writing-mode: vertical-lr;

        > .menu-item {
          padding-right: 1em;
          padding-left: 1em;
          height: 30px;
          line-height: 30px;
          writing-mode: horizontal-tb;

          & + .menu-item {
            margin-left: 0;
          }
        }
      }
    }
  }
}

.el-popover.popover-header-user-info {
  padding: 0;

  .section-user {
    width: 100%;

    > .user-item {
      padding-right: 15px;
      padding-left: 15px;
      min-height: 40px;
      font-size: 12px;

      & + .user-item {
        border-top: 1px solid $color-dedede;
      }

      &.user-item-link {
        line-height: 40px;
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }

      > .user-info {
        padding-bottom: 10px;

        > div:first-child {
          padding-top: 10px;
          font-size: 14px;
        }
      }

      > .scheme-info {
        padding-bottom: 10px;

        > .scheme-info-item {
          padding-top: 5px;
          padding-bottom: 5px;

          .el-progress {
            margin-top: 3px;
            margin-bottom: 3px;

            .el-progress-bar__outer {
              background-color: #dedede;
            }
          }
        }
      }
    }
  }
}

.el-popover.popover-header-note {
  padding: 0;

  .popover-note {
    width: 100%;

    .note-header,
    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      padding-left: 20px;
      height: 50px;
      font-size: 14px;
    }

    .note-header {
      border-bottom: 1px solid $color-dedede;

      .el-tabs__header {
        margin: 0;
        height: 50px;

        .el-tabs__item {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 50px;
        }
      }
    }

    .note-footer {
      height: 40px;
      border-top: 1px solid $color-dedede;
      justify-content: left;
    }

    .note-item {
      padding: 10px 20px;
      font-size: 12px;

      & + .note-item {
        border-top: 1px solid $color-dedede;
      }

      // &:hover .note-content { color: $color-primary; }
      .note-title {
        color: $color-1f1f1f;
      }

      .note-title:hover {
        color: $color-primary;

        .note-title1 {
          color: $color-primary;
        }
      }

      .note-title1 {
        color: red;
      }

      .note-content {
        // display: -webkit-box;
        // overflow: hidden;
        // // word-break: break-word;
        // text-overflow: ellipsis;
        // white-space: break-spaces;
        // margin-top: 5px;
        // color:$color-616161;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 5px;
        color: $color-616161;
      }

      .note-content:hover {
        color: $color-primary;
      }

      .note-params {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5em;
        color: $color-8a8a8a;

        span + span {
          margin-left: 20px;
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
      display: flex;
      align-items: center;
      margin-right: 60px - 15px;

      .el-button {
        margin-left: 20px;
        font-size: 14px;
        font-weight: 700;
        cursor: auto;
      }
    }

    > .nav-item:hover {
      .nav-link {
        color: $color-primary;
      }
    }

    .nav-link {
      position: relative;
      display: block;
      padding-right: 15px;
      padding-left: 15px;
      color: $color-616161;
      cursor: pointer;

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
    > .tool-item {
      position: relative;
      cursor: pointer;

      &[data-dot='true']:after {
        position: absolute;
        top: 0;
        right: 0;
        width: 5px;
        height: 5px;
        border-radius: 3px;
        background-color: red;
        content: '';
      }

      .svg-icon {
        position: relative;
        top: 2px;
        width: 20px;
        height: 20px;
        fill: $color-primary;
      }

      & + .tool-item {
        margin-left: 10px;
      }
    }
  }
}

.layout-menu-breadcrumb {
  padding: 10px $interval-36 0 $interval-36;

  & + .layout-container {
    margin-top: 10px;
  }
}

.upd-form {
  .el-form-item__label {
    padding: 0;
  }
}

.layout-header-note {
  $note-height: 40px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  margin-top: 10px;
  margin-right: $interval-36;
  margin-left: $interval-36;
  height: $note-height;
  background-color: #fff;
  border-radius: $radius-2;
  box-shadow: $box-shadow-base;

  > .note-icon {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: $note-height;
    height: $note-height;
    background-color: $color-warning;
    font-size: 18px;
  }

  > .note-content {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 10px;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  > .note-detail {
    flex-shrink: 0;
    padding-left: 1em;
    width: 8em;
  }

  > .note-close {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: $note-height;
    height: $note-height;
    font-size: 16px;
    color: $color-8a8a8a;
    cursor: pointer;

    &:hover {
      color: $color-primary;
    }
  }
}
</style>
