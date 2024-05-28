import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Home from "./components/page";
import { Nav } from "./components/Nav";
import DebugPanel from "./components/DebugPanel"; // import the new DebugPanel component
import "./globals.css";

function App() {
    const {
        setup: {
            systemCalls: { spawn, move, add_item_rnd, combine_items },
            clientComponents: { Position, Moves, State, Inventory },
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

            return () => clearTimeout(timer);
        }
    }, [clipboardStatus.message]);

    window.inventory = inventory;
    window.state = state;
    console.log("STATE", state)

    return (
        <main className="flex flex-col h-full">
            {isDebugPanelVisible ? (
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
            )}
            <Nav state={state?.health} moves={moves} />
            <div className="flex-grow">
                <Home onFarm={add_item_rnd} account={account} />
            </div>
        </main>
    );
}

export default App;
