import { createApp } from "vue";
import App from "./App.vue";

import "./assets/p5.collide2d"; // register collide methods on p5.prototype

createApp(App).mount("#app");
