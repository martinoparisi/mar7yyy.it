import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Sito multipagina: ogni .html in radice e' una pagina a se'.
 * In produzione l'URL pulito lo fa nginx (`try_files $uri $uri.html ...`);
 * qui si replica lo stesso mapping per dev e preview.
 */
const urlPulite: Plugin = {
  name: "url-pulite",
  configureServer(server) {
    server.middlewares.use(riscrivi);
  },
  configurePreviewServer(server) {
    server.middlewares.use(riscrivi);
  },
};

const pagine = ["identity"];

function riscrivi(
  req: { url?: string },
  _res: unknown,
  next: () => void,
): void {
  const [percorso, query] = (req.url ?? "").split("?");
  const nome = percorso.replace(/^\/|\/$/g, "");
  if (pagine.includes(nome)) {
    req.url = `/${nome}.html${query ? `?${query}` : ""}`;
  }
  next();
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), urlPulite],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        identity: "identity.html",
      },
    },
  },
});
