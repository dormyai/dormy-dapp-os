import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx"
import UnoCSS from 'unocss/vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import postCssPxToRem from 'postcss-pxtorem';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      UnoCSS(),
      vueJsx(),
      AutoImport({
        resolvers: [ArcoResolver()],
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: true,
            importStyle: 'less',
          })
        ]
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'border-radius-medium': '8px',
          },
          javascriptEnabled: true,
        }
      },
      postcss:{
        plugins:[
          postCssPxToRem({
            rootValue: 50,
            propList:['*'],
            exclude: /node_modules/i
          })
        ]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src') 
      }
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_PROXY_DOMAIN,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        },
      }
    }, 
  }
})
