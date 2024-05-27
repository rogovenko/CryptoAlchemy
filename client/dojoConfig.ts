import manifest from "../dojo-starter/manifests/dev/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

console.log("MANIFEST", manifest)

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: "https://api.cartridge.gg/x/cryptoalchemy/katana",
    toriiUrl: "https://us-east.api.cartridge.gg/x/cryptoalchemy/torii",
});
