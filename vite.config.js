import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [legacy({
    targets:['chrome 52'],  // 需要兼容的目标列表，可以设置多个
    additionalLegacyPolyfills:['regenerator-runtime/runtime'] // 面向IE11时需要此插件
  }), react()],
})
