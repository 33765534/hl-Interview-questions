import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/hl-Interview-questions/" /* 基础虚拟路径: */,
  dest: "dist" /* 打包文件基础路径, 在命令所在目录下 */,  
  title: "面试题", // 标题
  plugins: [vue()],
  optimizeDeps: {
  }
})
