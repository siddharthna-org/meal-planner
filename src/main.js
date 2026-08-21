// Import Bootstrap CSS via SCSS
import "./scss/styles.scss";
import * as bootstrap from "bootstrap";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { seedDevelopmentData } from "./seedDevelopmentData";

async function startApp() {
	const shouldSeed = import.meta.env.DEV && import.meta.env.VITE_SEED_DATA === "true";

	if (shouldSeed) {
		try {
			await seedDevelopmentData();
		} catch (error) {
			console.error("[seed] Failed to seed development data", error);
		}
	}

	createApp(App).use(router).mount("#app");
}

startApp();
