import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/hl-Interview-questions/" /* 基础虚拟路径: */,
  title: "面试题", // 标题
  plugins: [vue()],
  optimizeDeps: {
  }
})
