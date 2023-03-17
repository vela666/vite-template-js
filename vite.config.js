import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://github.com/gxmari007/vite-plugin-eslint
import eslint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueSetupExpand from 'vite-plugin-vue-setup-expand'

// https://vitejs.dev/config/
// https://cn.vitejs.dev/config/#using-environment-variables-in-config
// 加载 'src/style/resources' 下面的 scss
const scssResources = []
const cssPath = 'src/styles/config'
fs.readdirSync(cssPath).map((dirname) => {
  if (fs.statSync(`${cssPath}/${dirname}`).isFile()) {
    scssResources.push(`@use "${cssPath}/${dirname}" as *;`)
  }
})
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const { VITE_APP_TITLE } = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueSetupExpand(),
      {
        ...eslint({
          failOnError: false,
        }),
      },
      AutoImport({
        /*eslintrc: {
          enabled: true
        },*/
        // 自动引入以下方法
        // imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [
          ElementPlusResolver({
            // 自定义命名空间且按需导入必需，不然样式不会被引入
            importStyle: 'sass',
          }),
        ],
        // 该目录下的文件会被自动导入，但每次新加的变量或函数需重启项目
        // dirs: ['./src/utils'],
        vueTemplate: true,
      }),
      //
      Components({
        // 默认导入src/components文件夹下的组件
        // dirs: ['src/components'],
        resolvers: [
          ElementPlusResolver({
            // 自定义命名空间且按需导入必需，不然样式不会被引入
            importStyle: 'sass',
          }),
        ],
      }),
    ],
    // https://cn.vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join(''),
          /*additionalData: `
           @use "@/styles/config/element" as *;
           // 全局变量
           @use '@/styles/config/variables' as *;
         `,*/
        },
      },
    },
    // 全局变量
    define: {
      __APP_ENV__: JSON.stringify(VITE_APP_TITLE),
    },
  }
})
