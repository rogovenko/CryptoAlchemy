import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { usePlayer } from "./context/usePlayerContext";
import Farm from "./components/Farm";
import { Nav } from "./components/Nav";
import DebugPanel from "./components/DebugPanel";
import "./globals.css";
import React from "react";

interface AppProps {
    type: "farm" | "build"
}

const App: React.FC<AppProps> = React.memo(({ type }) => {
    
    const state = usePlayer();

    window.inventory = state.inventory;
    window.state = state;
    console.log("STATE", state)

    const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false);

    return (
        <main className="flex flex-col h-full">
            {isDebugPanelVisible ? (
                <DebugPanel onClose={() => setIsDebugPanelVisible(false)} />
            ) : (
                <button className="debug-button" onClick={() => setIsDebugPanelVisible(true)}>
                    Debug
                </button>
            )}
            <Nav />
            <div className="flex-grow">
                {type === "farm" && <Farm onFarm={state.onFarm} account={state.account} />}
            </div>
        </main>
    );
})

export default App;
