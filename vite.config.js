import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],

// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['global'] // 只注入global polyfill
    })
  ],
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src'),
    }
  }
})