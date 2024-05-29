import { useComponentValue, useSubscribeEntityModel } from "@dojoengine/react";
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

function App() {
    const {
        setup: {
            systemCalls: { spawn, move, add_item_rnd, combine_items, create_bid },
            clientComponents: { Position, Moves, State, Inventory, Bid },
        },
        account,
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false); // Set to false by default

    const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);
    const state = useComponentValue(State, entityId);
    const inventory = useComponentValue(Inventory, entityId);

    const handleRestoreBurners = async () => {
        try {
            await account?.applyFromClipboard();
            setClipboardStatus({
                message: "Burners restored successfully!",
                isError: false,
            });
        } catch (error) {
            setClipboardStatus({
                message: `Failed to restore burners from clipboard`,
                isError: true,
            });
        }
    };

    useEffect(() => {
        if (clipboardStatus.message) {
            const timer = setTimeout(() => {
                setClipboardStatus({ message: "", isError: false });
            }, 3000);

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
