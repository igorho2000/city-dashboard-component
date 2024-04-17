import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	optimizeDeps: {
		include: ["./assets/**/*.{jpg,png,gif,svg}"],
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "DashboardComponent",
			fileName: "index",
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["vue"],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
