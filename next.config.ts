import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hay un package-lock.json huérfano en el home del usuario; fijamos la raíz
  // para que Turbopack no infiera un workspace incorrecto.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
