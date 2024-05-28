import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import { usePlayer } from "./context/usePlayerContext";
import Home from "./components/page";
import { Nav } from "./components/Nav";
import DebugPanel from "./components/DebugPanel";
import "./globals.css";

function App() {
    
    const state = usePlayer();

    window.inventory = state.inventory;
    window.state = state;
    console.log("STATE", state)

    return (
        <main className="flex flex-col h-full">
            {/* {isDebugPanelVisible ? (
                <DebugPanel
                    account={account}
                    clipboardStatus={clipboardStatus}
                    handleRestoreBurners={handleRestoreBurners}
                    spawn={spawn}
                    add_item_rnd={add_item_rnd}
                    combine_items={combine_items}
                    onClose={() => setIsDebugPanelVisible(false)}
                />
            ) : (
                <button className="debug-button" onClick={() => setIsDebugPanelVisible(true)}>
                    Debug
                </button>
            )} */}
            <Nav />
            <div className="flex-grow">
                <Home onFarm={state.onFarm} account={state.account} />
            </div>
        </main>
    );
}

export default App;
