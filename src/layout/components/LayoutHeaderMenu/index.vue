<template>
  <section v-if="$route.meta.id" class="layout-header-menu">
    <!--    <ul class="menu">
          <template v-for="item in list.menus">
            <li v-if="!item.hidden" :key="item.menu_id" class="menu-item">
              <router-link
                :class="{'router-link-active': item.menu_id === $route.meta.parentId[1]}"
                :to="item.menu_path"
                class="menu-link"
              >{{ item.menu_name }}
              </router-link>
            </li>
          </template>
        </ul>

        <ul v-if="list.submenus.length > 0" class="submenu">
          <template v-for="item in list.submenus">
            <li v-if="!item.hidden" :key="item.menu_id" class="submenu-item">
              <router-link :to="item.menu_path" class="submenu-link">{{ item.menu_name }}</router-link>
            </li>
          </template>
          <li id="submenus-slot"></li>
        </ul>-->
    <template v-for="menu in asyncRoutes">
      <ul
        v-if="menu.menu_id === $route.meta.parentId[0]"
        :key="menu.menu_id"
        class="menu">
        <template v-for="item in menu.children">
          <li v-if="!item.hidden" :key="item.menu_id" class="menu-item">
            <router-link
              :class="{
                'router-link-active': item.menu_id === $route.meta.parentId[1],
              }"
              :to="item.menu_path"
              class="menu-link"
              >{{ item.menu_name }}
            </router-link>
          </li>
        </template>
      </ul>
      <template v-for="list in menu.children">
        <ul
          v-if="list.menu_id === $route.meta.parentId[1]"
          :key="list.menu_id"
          class="submenu">
          <template v-for="item in list.children">
            <li v-if="!item.hidden" :key="item.menu_id" class="submenu-item">
              <router-link :to="item.menu_path" class="submenu-link">{{
                item.menu_name
              }}</router-link>
            </li>
          </template>
          <li id="submenus-slot"></li>
        </ul>
      </template>
    </template>
  </section>
</template>

<script setup name="LayoutHeaderMenu">
import usePermissionStore from '@/stores/modules/permission'
import { storeToRefs } from 'pinia'
const store = usePermissionStore()
const { asyncRoutes } = storeToRefs(store)

/*const route = useRoute();

    const list = computed(() => {
      const menus = [];
      const submenus = [];
      const asyncRoutes = store.state.permission.asyncRoutes;

      for (let i = 0; i < asyncRoutes.length; i++) {
        if (asyncRoutes[i].menu_id === route.meta.parentId[0]) {
          menus.push(...asyncRoutes[i].children);
          if (route.meta.parentId[1]) {
            for (let k = 0; k < asyncRoutes[i].children.length; k++) {
              if (asyncRoutes[i].children[k].menu_id === route.meta.parentId[1]) {
                submenus.push(...asyncRoutes[i].children[k].children);
                break;
              }
            }
          }

          break;
        }
      }
      return {
        menus,
        submenus,
      };
    });*/
// const asyncRoutes = computed(() => store.state.permission.asyncRoutes)
</script>

<style lang="scss" scoped>
#submenus-slot {
  flex-grow: 1;
}
.layout-header-menu {
  overflow: hidden;
  margin: $size-24 $size-36 0;
  background-color: $color-fff;
  box-shadow: $box-shadow-base;
  border-radius: $size-4;
  font-size: 14px;

  > .menu {
    display: flex;
    height: $size-60;
    line-height: $size-60;

    .menu-link {
      display: block;
      padding-right: 40px;
      padding-left: 40px;
      color: $color-616161;

      &:hover {
        background-color: rgba($color-primary, 0.2);
      }

      &.router-link-active {
        background-color: $color-primary;
        color: $color-fff;
      }
    }
  }

  > .submenu {
    display: flex;
    flex-wrap: wrap;
    padding: 15px $size-20 0;
    line-height: 30px;
    border-top: 1px solid $color-dedede;

    > .submenu-item {
      margin-bottom: 15px;
    }

    .submenu-link {
      display: block;
      padding-right: 35px;
      padding-left: 35px;
      height: 30px;
      border: 1px solid transparent;
      border-radius: $size-2;
      color: $color-616161;

      &:hover {
        background-color: $color-fff;
        color: $color-primary;
      }

      &.router-link-active {
        background-color: rgba($color-primary, 0.06);
        border-color: $color-primary;
        color: $color-primary;
      }
    }
  }
}

.layout-header-note + .layout-header-menu {
  margin-top: 10px;
}
</style>
