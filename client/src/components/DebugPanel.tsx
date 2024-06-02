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
            systemCalls: { spawn, move, add_item_rnd, combine_items, create_shop, create_bid },
            clientComponents: { Position, Moves, State, Inventory, Shop },
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

    const shopId = getEntityIdFromKeys([
        BigInt("0x6561730b72beaba504e41a42c3f2c88bbd8eb240c13ce070bc721fd267eea1d"),
    ]) as Entity;

    console.log("KEK1", account?.account.address)
    // console.log("KEK2", shopId)

    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);
    const state = useComponentValue(State, entityId);
    const inventory = useComponentValue(Inventory, entityId);
    const shop = useComponentValue(Shop, entityId);

    window.shop = shop;
    console.log("SHOP", shop)

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
                <button onClick={() => create_shop(account.account)}>
                    Create shop
                </button>
            </div>
            <div>
                <button onClick={() => create_bid(account.account, 0, 1, 1, account.account)}>
                    Create bid
                </button>
            </div>
            <div className="card">
                <div>{`burners deployed: ${account.count}`}</div>
                <div>
                    select signer:{" "}
                    <select
                        value={account ? account.account.address : ""}
                        onChange={(e) => account.select(e.target.value)}
                    >
                        {account?.list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                </div>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DebugPanel;
