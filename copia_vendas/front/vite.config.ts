import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3333',
      '/clientes': 'http://localhost:3333',
      '/fornecedores': 'http://localhost:3333',
      '/pedidos': 'http://localhost:3333',
      '/produtos': 'http://localhost:3333',
      '/categorias': 'http://localhost:3333',
      '/vendedores': 'http://localhost:3333',
      '/agenda': 'http://localhost:3333',
    },
  },
})
