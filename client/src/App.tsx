import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Home from "./components/page";
import { Nav } from "./components/Nav";
import "./globals.css";

function App() {
    const {
        setup: {
            systemCalls: { spawn, move, add_item_rnd },
            clientComponents: { Position, Moves, Health, Inventory },
        },
        account,
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

    // get current component values
    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);
    const health = useComponentValue(Health, entityId);
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

    useEffect(() => {
        spawn(account.account);
    }, [account.account, spawn]);

    return (
        <main className="flex flex-col h-full">
            <Nav health={health} moves={moves}/>
            <div className="flex-grow">
                <Home />
            </div>
        </main>
    );
}

export default App;
