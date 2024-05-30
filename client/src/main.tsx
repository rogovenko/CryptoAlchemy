import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { setup } from "./dojo/generated/setup.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig.ts";
import { PlayerProvider } from "./context/usePlayerContext.tsx";

async function init() {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("React root not found");
    const root = ReactDOM.createRoot(rootElement as HTMLElement);
    const setupResult = await setup(dojoConfig);

    root.render(
        <React.StrictMode>
            <DojoProvider value={setupResult}>
                <PlayerProvider>
                    <App />
                </PlayerProvider>
            </DojoProvider>
        </React.StrictMode>
    );
}

init();
