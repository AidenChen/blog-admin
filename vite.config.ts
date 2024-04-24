import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import lightningcss from 'vite-plugin-lightningcss';

// https://vitejs.dev/config/
export default defineConfig((options) => {
  const { mode } = options;
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dirs: [], // 手动置空，避免src/components目录下的组件被自动解析
        resolvers: [ElementPlusResolver()]
      }),
      // 代替postcss
      lightningcss({
        browserslist: '>= 0.25%'
      })
    ],
    server: {
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/dev': {
          target: env.VITE_API_BASE,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/dev/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'inline-attachment': '/public/codemirror-4.inline-attachment.js'
      }
    }
  };
});
