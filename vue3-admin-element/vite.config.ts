import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// 自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),

    // 自动导入 vue API + ElementPlus API + 图标组件
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(), // 自动导入 ElementPlus 相关函数
        IconsResolver(), // 自动导入图标组件
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      dts: path.resolve(pathSrc, 'types', 'auto-imports.d.ts'),
    }),

    // 自动注册组件（ElementPlus + 图标）
    Components({
      resolvers: [
        ElementPlusResolver(), // 自动注册 ElementPlus 组件
        IconsResolver({
          enabledCollections: ['ep'], // 启用 element-plus 图标集
        }),
      ],
      dts: path.resolve(pathSrc, 'types', 'components.d.ts'),
    }),

    // 自动安装图标
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server:{
    host:'0.0.0.0',
    port:Number(env.VITE_APP_PORT) || 3000,
    open:true, //运行自动打开浏览器
    // 反向代理解决跨域
    proxy:{
      [env.VITE_APP_BASE_API || '/api']:{
        target:'http://vapi.youlai.tech',
        changeOrigin:true,
        rewrite:path =>
          path.replace(new RegExp('^' + env.VITE_APP_BASE_API || '/api'),'')
      }
    }

  }
  }
})
