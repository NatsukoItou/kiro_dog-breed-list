import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  build: {
    // バンドルサイズ最適化の設定
    rollupOptions: {
      output: {
        // チャンクを分割してコード分割を最適化
        manualChunks: {
          // React関連のライブラリを別チャンクに分離
          'react-vendor': ['react', 'react-dom'],
          // ルーティング関連を別チャンクに分離
          'router-vendor': ['react-router-dom'],
        },
      },
    },
    // 圧縮を有効化
    minify: 'terser',
    // ソースマップを本番環境では無効化（サイズ削減）
    sourcemap: false,
    // チャンクサイズの警告しきい値を調整
    chunkSizeWarningLimit: 1000,
  },
  // 開発サーバーの最適化
  server: {
    // HMRの最適化
    hmr: {
      overlay: false,
    },
  },
})
