import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true, // cho phép truy cập từ điện thoại/thiết bị khác trong cùng mạng LAN
    // Proxy giúp frontend gọi "/api/..." mà không cần ghi domain đầy đủ,
    // Vite sẽ tự chuyển tiếp sang backend đang chạy ở port 5000.
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
