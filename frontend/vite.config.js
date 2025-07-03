import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const PORT = parseInt(env.VITE_PORT || '3002')
    const BACKEND_URL = env.VITE_BACKEND_URL || 'http://localhost:5001'

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: PORT,
            strictPort: true, // This will make Vite fail if port is not available instead of trying another port
            proxy: {
                '/api': {
                    target: BACKEND_URL,
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('proxy error', err);
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            console.log('Sending Request to the Target:', req.method, req.url);
                        });
                        proxy.on('proxyRes', (proxyRes, req, _res) => {
                            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                        });
                    },
                }
            }
        }
    }
})