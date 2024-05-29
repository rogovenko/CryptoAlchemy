import React from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "../dojo/useDojo";

let count = 0

const DebugPanel = ({
    // account,
    // clipboardStatus,
    // handleRestoreBurners,
    // spawn,
    // add_item_rnd,
    // combine_items,
    onClose,
}) => {
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
    return (
        <div className="debug-panel">
            <button onClick={() => account?.create()}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>
            {account && account?.list().length > 0 && (
                <button onClick={async () => await account?.copyToClipboard()}>
                    Save Burners to Clipboard
                </button>
            )}
            <button onClick={handleRestoreBurners}>
                Restore Burners from Clipboard
            </button>
            {clipboardStatus.message && (
                <div className={clipboardStatus.isError ? "error" : "success"}>
                    {clipboardStatus.message}
                </div>
            )}
            <button onClick={() => spawn(account.account)}>Spawn</button>
            <div>
                <button onClick={() => add_item_rnd(account.account, 1)}>
                    Add Item
                </button>
            </div>
            <div>
                <button onClick={() => combine_items(account.account, 0, 1)}>
                    Combo!
                </button>
            </div>
            <div>
                <button onClick={() => {count++; create_bid(account.account, count)}}>
                    Create bid!
                </button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DebugPanel;
