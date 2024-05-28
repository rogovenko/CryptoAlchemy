import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Prev from "./demo/Demo.tsx"
import { setup } from "./dojo/generated/setup.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig.ts";
import { BrowserRouter, Routes, Route } from "react-router-dom";

async function init() {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("React root not found");
    const root = ReactDOM.createRoot(rootElement as HTMLElement);

    const setupResult = await setup(dojoConfig);

    root.render(
        <React.StrictMode>
            <DojoProvider value={setupResult}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/demo" element={<Prev />} />
                    </Routes>
                </BrowserRouter>
            </DojoProvider>
        </React.StrictMode>
    );
}

init();
